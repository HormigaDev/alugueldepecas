const db = require('../../database');
const SQLError = require('../../utils/SQLError');

function salvarAnuncio({ id_usuario, id_ferramenta, detalhes, localizacao, disponibilidade }){
  const sql = db.read('insert', 'criar_novo_anuncio');
  return new Promise((resolve, reject) => {
    db.run(sql, [id_usuario, id_ferramenta, detalhes, localizacao, disponibilidade], async (err) => {
      if(err){
        console.log(err);
        reject(new SQLError('Erro ao salvar anúncio'));
      } else {
        const id = await db.last_rowid();
        resolve(id);
      }
    });
  });
}

module.exports = salvarAnuncio;