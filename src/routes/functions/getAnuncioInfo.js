const db = require('../../database');
const SQLError = require('../../utils/SQLError');

function getAnuncioInfo(id_ferramenta){
  const sql = db.read('select', 'anuncio_info');
  return new Promise((resolve, reject) => {
    db.get(sql, [id_ferramenta], (err, row) => {
      if(err){
        console.log(err);
        reject(new SQLError("Ocorreu um erro ao buscar o anúncio"))
      } else {
        resolve(row??{});
      }
    });
  })
}

module.exports = getAnuncioInfo;