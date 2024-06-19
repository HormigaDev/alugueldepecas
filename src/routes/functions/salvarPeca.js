const db = require('../../database');
const SQLError = require('../../utils/SQLError');

function salvarPeca({ descricao, nome, valor, id_usuario }){
  const sql = db.read('insert', 'nova_peca');
  return new Promise((resolve, reject) => {
    db.run(sql, [descricao, nome, valor, id_usuario], async (err) => {
      if(err){
        console.log(err);
        reject(new SQLError('Erro ao salvar peça'));
      } else {
        const id = await db.last_rowid();
        resolve(id);
      }
    });
  });
}

module.exports = salvarPeca;