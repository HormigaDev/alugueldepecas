const db = require('../../database');
const SQLError = require('../../utils/SQLError');

/**
 * 
 * @param {string} senha - A senha deve ser criptografada antes de ser salva no banco de dados
 * A senha deve ter no mínimo 8 caracteres, contendo letras maiúsculas, minúsculas, números e caracteres especiais
 * @returns {Promise<boolean>}
 */
function saveUser({nome, CPF, email, telefone, endereco, bairro, cep, senha}){
  const sql = db.read('insert', 'new_user');
  return new Promise(async (resolve, reject) => {
    db.run(sql, [nome, CPF, email, telefone, endereco, bairro, cep, senha], async (err) => {
      if(err){
        console.log(err);
        reject(new SQLError('Ocorreu um erro ao salvar o usuário. Por favor, tente novamente mais tarde.'));
      } else {
        const id = await db.last_rowid();
        resolve(id);
      }
    })
  });
}

module.exports = saveUser;