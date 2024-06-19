const db = require('../../database');
const { encriptar, comparar } = require('../../utils/crypto');
const ValidationError = require('../../utils/ValidationError');
const SQLError = require('../../utils/SQLError');

const userInfo = require('../functions/userInfo');

module.exports = {
  path: '/login',
  async handler(req, res){
    try {
      let { email, password } = req.body;
      if(!email || !password){
        throw new ValidationError('Email e senha são obrigatórios');
      }
      let regEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if(!regEmail.test(email)){
        throw new ValidationError('Email inválido');
      }
      const sql = db.read('select', 'user_login');
      db.get(sql, [email], async (err, row) => {
        if(err){
          console.log(err);
          res.status(500).json({message: 'Erro interno do servidor. Por favor tente mais tarde'});
        } else {
          if(!row){
            return res.status(404).json({message: 'Usuário não encontrado. E-mail não cadastrado'});
          } else {
            const userId = await comparar(password, row.senha) ? row.id : null;
            if(!userId){
              return res.status(401).json({message: 'Senha incorreta'});
            } else {
              const token = encriptar({userId});
              const userinfo = await userInfo(userId);
              return res.status(200).json({token, userinfo});
            }
          }
        }
      });
    } catch(err){
      if(err instanceof ValidationError){
        return res.status(400).json({message: err.message});
      } else {
        console.log(err);
        return res.status(500).json({message: 'Erro interno do servidor. Por favor tente mais tarde'});
      }
    }
  }
}