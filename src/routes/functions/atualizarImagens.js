const  db = require('../../database');
const SQLError = require('../../utils/SQLError');

function atualizarImagens(id_ferramenta, imagens){
  const deleteSQL = db.read('delete', 'imagens_ferramenta');
  const insertSQL = db.read('insert', 'nova_imagem');
  return new Promise((resolve, reject) => {
    db.run(deleteSQL, [id_ferramenta], (err) => {
      if(err){
        console.log(err);
        reject(new SQLError("Ocorreu um erro ao tentar excluir as imagens prévias"));
      } else {
        let erro = false;
        for(const imagem of imagens){
          if(erro) return;
          db.run(insertSQL, [id_ferramenta, imagem], (err) => {
            if(err){
              console.log(err);
              erro = true;
              reject(new SQLError("Ocorreu um erro ao tentar inserir as novas imagens"));
            }
          })
        }
        resolve(true);
      }
    })
  });
}

module.exports = atualizarImagens;