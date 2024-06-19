const db = require('../../database');
const ValidationError = require('../../utils/ValidationError'); 
const SQLError = require('../../utils/SQLError');

const saveUser = require('../functions/saveUser');
const existsUser = require('../functions/existsUser');
const validateModel = require('../../utils/validateModel');
const schema = require('../../schemas/usuario');
const { cifrar, encriptar } = require('../../utils/crypto');
const getUserInfo = require('../functions/userInfo');

module.exports = {
  path: '/criar-usuario',
  async handler(req, res){
    try {
      const { nome, CPF, email, telefone, endereco, bairro, cep, senha } = req.body;
      validateModel({ nome, CPF, email, telefone, endereco, bairro, cep, senha }, schema); // Valida se o modelo segue o esquema antes de continuar
      const userExists = await existsUser(CPF, email);
      if(userExists){
        throw new ValidationError('Usuário já existe');
      }
      db.serialize(async () => {
        try {
          const hash = await cifrar(senha);
          await db.begin();
          const userId = await saveUser({ nome, CPF, email, telefone, endereco, bairro, cep, senha: hash });
          const userInfo = await getUserInfo(userId);
          const token = encriptar({ userId });
          await db.commit();
          res.status(201).json({ message: 'Usuário criado com sucesso', token, userinfo: userInfo });
        } catch(err){
          await db.rollback();
          if(err instanceof SQLError){
            return res.status(500).json({ message: err.message });
          } else {
            console.log(err);
            return res.status(500).json({ message: 'Ocorreu um erro ao criar o usuário. Por favor, tente novamente mais tarde.'});
          }
        }
      });
    } catch(err){
      if(err instanceof ValidationError){
        res.status(400).json({ message: err.message });
      } else {
        console.log(err);
        res.status(500).json({ message: 'Ocorreu um erro ao criar o usuário. Por favor, tente novamente mais tarde.'});
      }
    }

  }
}