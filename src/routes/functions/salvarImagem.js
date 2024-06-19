const db = require('../../database');
const SQLError = require('../../utils/SQLError');

function salvarImagem({ id_ferramenta, base64 }){
  const sql = db.read('insert', 'nova_imagem');
  return new Promise((resolve, reject) => {
    db.run(sql, [id_ferramenta, base64], async (err) => {
      if(err){
        console.log(err);
        reject(new SQLError('Erro ao salvar imagem'));
      } else {
        resolve(true);
      }  
    });
  });
}

module.exports = salvarImagem;