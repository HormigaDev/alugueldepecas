const db = require('../../database');

module.exports = {
  path: '/anuncio-contatar',
  async handler(req, res){
    try {
      const idAnuncio = parseInt(req.query.id_anuncio);
      if(!idAnuncio){
        return res.status(400).json({message: 'ID do anúncio é obrigatório'});
      }
      if(isNaN(idAnuncio)){
        return res.status(400).json({message: 'ID do anúncio inválido'});
      }
      const sql = db.read('select', 'anuncio_contatar');
      db.get(sql, [idAnuncio], (err, row) => {
        if(err){
          console.log(err);
          return res.status(500).json({message: 'Erro interno do servidor. Por favor tente mais tarde'});
        } else {
          return res.status(200).json({anuncio: row??{}});
        }
      })
    } catch(err){
      console.log(err);
      return res.status(500).json({message: 'Erro interno do servidor. Por favor tente mais tarde'});
    }
  }
}