const db = require('../../database');
const SQLError = require('../../utils/SQLError');

function getAnuncioImagens(id_ferramenta){
  const sql = db.read('select', 'anuncio_imagens');
  return new Promise((resolve, reject) => {
    db.all(sql, [id_ferramenta], (err, rows) => {
      if(err){
        console.log(err);
        reject(new SQLError("Ocorreu um erro ao buscar as imagens do anúncio"))
      } else {
        resolve(rows??[]);
      }
    });
  });
}

module.exports = getAnuncioImagens;