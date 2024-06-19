const db = require('../../database');
const ValidationError = require('../../utils/ValidationError');
const SQLError = require('../../utils/SQLError');

const validateModel = require('../../utils/validateModel');
const schema = require('../../schemas/anuncio');
const salvarPeca = require('../functions/salvarPeca');
const salvarImagem = require('../functions/salvarImagem');
const salvarAnuncio = require('../functions/salvarAnuncio');

module.exports = {
  path: '/cadastrar-novo-anuncio',
  async handler(req, res){
    try {
      const { nome, descricao,  detalhes, localizacao, valor, disponibilidade, imagens } = req.body;
      const userId = req.userId;
      validateModel({nome, descricao, detalhes, localizacao, valor, disponibilidade}, schema);
      db.serialize(async() => {
        try {
          await db.begin();
          const pecaId = await salvarPeca({descricao, nome, valor, id_usuario: userId});
          if(!imagens){
            throw new ValidationError('Imagens são obrigatórias');
          }
          if(imagens.length < 1){
            throw new ValidationError('Pelo menos uma imagem é obrigatória');
          }
          for(const image of imagens){
            await salvarImagem({id_ferramenta: pecaId, base64: image});
          }
          await salvarAnuncio({id_usuario: userId, id_ferramenta: pecaId, detalhes, localizacao, disponibilidade});
          await db.commit();
          return res.status(200).json({message: 'Anúncio cadastrado com sucesso'});
        } catch(err){
          await db.rollback();
          if(err instanceof SQLError){
            return res.status(500).json({message: err.message});
          } else {
            console.log(err);
            return res.status(500).json({message: 'Erro interno do servidor. Por favor tente mais tarde'});
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