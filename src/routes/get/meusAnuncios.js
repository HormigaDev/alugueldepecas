const db = require('../../database');

module.exports = {
  path: '/meus-anuncios',
  async handler(req, res){
    try {
      const sql = db.read('select', 'meus_anuncios');
      const userId = req.userId;
      const search = req.query.search??'';
      db.all(sql, [search, search, userId], async (err, rows) => {
        if(err){
          console.log(err);
          res.status(500).json({message: 'Erro interno do servidor. Por favor tente mais tarde'});
        } else {
          for(anuncio of rows){
            await (() => { return new Promise((resolve, reject) => {
              db.get('SELECT imagem FROM imagens WHERE id_ferramenta = ?', [anuncio.id_anuncio], (err, row) => {
                if(err){
                  console.log(err);
                  return reject(new Error('Erro interno do servidor. Por favor tente mais tarde'));
                }
                if(row){
                  anuncio.image = row.imagem;
                  resolve();
                } else {
                  resolve();
                }
              })
            })})()
          }
          res.status(200).json({anuncios: rows});
        }
      })
    } catch(err){
      console.log(err);
      return res.status(500).json({message: 'Erro interno do servidor. Por favor tente mais tarde'});
    }
  }
}