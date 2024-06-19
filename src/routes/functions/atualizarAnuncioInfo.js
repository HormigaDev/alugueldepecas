const db = require('../../database');
const SQLError = require('../../utils/SQLError');

function atualizarAnuncioInfo(id_ferramenta, detalhes, localizacao, disponibilidade){
  const sql = db.read('update', 'anuncio');
  return new Promise((resolve, reject) => {
    db.run(sql, [detalhes, localizacao, disponibilidade, id_ferramenta], (err) => {
      if(err){
        console.log(err);
        reject(new SQLError('Erro ao atualizar anúncio'))
      } else {
        resolve(true);
      }
    });
  });
}

module.exports = atualizarAnuncioInfo;