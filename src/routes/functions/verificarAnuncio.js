const db = require('../../database');
const SQLError = require('../../utils/SQLError');

function verificarAnuncio(id_usuario, id_ferramenta){
  const sql = db.read('select', 'verificar_anuncio');
  return new Promise((resolve, reject) => {
    db.get(sql, [id_usuario, id_ferramenta], (err, row) => {
      if(err){
        console.log(err);
        reject(new SQLError('Erro ao verificar anúncio'));
      } else {
        resolve(row !== undefined)
      }
    });
  });
}

module.exports = verificarAnuncio;