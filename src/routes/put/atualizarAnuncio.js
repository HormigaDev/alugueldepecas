const db = require('../../database');
const ValidationError = require('../../utils/ValidationError');
const SQLError = require('../../utils/SQLError');

const schema = require('../../schemas/anuncio');
const validateModel = require('../../utils/validateModel');
const atualizarAnuncioInfo = require('../functions/atualizarAnuncioInfo');
const atualizarFerramenta = require('../functions/atualizarFerramenta');
const atualizarImagens = require('../functions/atualizarImagens');
const verificarAnuncio = require('../functions/verificarAnuncio');

module.exports = {
  path: '/atualizar-anuncio',
  async handler(req, res){
    try {
      const userId = req.userId;
      const r = req.body;
      const model = {
        nome: r.nome,
        descricao: r.descricao,
        detalhes: r.detalhes,
        localizacao: r.localizacao,
        valor: r.valor,
        disponibilidade: r.disponibilidade
      }
      validateModel(model, schema);
      const id_ferramenta = r.id_ferramenta;
      if(!await verificarAnuncio(userId, id_ferramenta)){
        throw new ValidationError('Anúncio não encontrado ou não pertence ao usuário');
      }
      if(r.imagens.length === 0){
        throw new ValidationError('É necessário ao menos uma imagem para o anúncio');
      }
      db.serialize(async () => {
        try {
          await db.begin();
          await atualizarAnuncioInfo(id_ferramenta, r.detalhes, r.localizacao, r.disponibilidade);
          await atualizarFerramenta(id_ferramenta, r.descricao, r.nome, r.valor);
          await atualizarImagens(id_ferramenta, r.imagens);
          await db.commit();
          res.status(200).json({message: 'Anúncio atualizado com sucesso'});
        } catch(err){
          await db.rollback();
          if(err instanceof SQLError){
            res.status(500).json({error: err.message});
          } else {
            console.log(err);
            res.status(500).json({error: "Ocorreu um erro inesperado"});
          }
        }
      })
    } catch(err){
      if(err instanceof ValidationError){
        res.status(400).json({message: err.message});
      } else {
        console.log(err);
        res.status(500).json({error: "Ocorreu um erro inesperado"});
      }
    }
  }
}