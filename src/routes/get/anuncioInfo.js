const SQLError = require('../../utils/SQLError');

const getAnuncioInfo = require('../functions/getAnuncioInfo');
const getAnuncioImagens = require('../functions/getAnuncioImagens');

module.exports = {
  path: '/anuncio-info',
  async handler(req, res){
    try {
      const { idAnuncio } = req.query;
      if(!idAnuncio) return res.status(400).json({ message: 'ID não informado' });
      if(isNaN(parseInt(idAnuncio))) return res.status(400).json({ message: 'ID inválido' });
      const anuncio = await getAnuncioInfo(idAnuncio);
      const imagens = await getAnuncioImagens(idAnuncio);
      anuncio.imagens = imagens;
      res.status(200).json({ anuncio });
    } catch(err){
      if(err instanceof SQLError){
        res.status(500).json({error: err.message});
      } else {
        console.log(err);
        res.status(500).json({error: "Ocorreu um erro inesperado"});
      }
    }
  }
}