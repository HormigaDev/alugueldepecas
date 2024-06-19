const db = require('../../database');
const SQLError = require('../../utils/SQLError');

function atualizarFerramenta(id_ferramenta, descricao, nome, valor){
  const sql = db.read('update', 'ferramenta');
  return new Promise((resolve, reject) => {
    db.run(sql, [descricao, nome, valor, id_ferramenta], (err) => {
      if(err){
        console.log(err);
        reject(new SQLError('Erro ao atualizar ferramenta'))
      } else {
        resolve(true);
      }
    });
  });
}

module.exports = atualizarFerramenta;