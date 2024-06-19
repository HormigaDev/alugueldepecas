const db = require('../../database');
const SQLError = require('../../utils/SQLError');

/**
 * 
 * @param {string} CPF - O CPF para verificar se um usuário com esse CPF já existe
 * @param {string} email - O email para verificar se um usuário com esse email já existe   
 * @returns {Promise<boolean>}
 */
function existsUser(CPF, email){
  const sql = db.read('select', 'exists_user');
  return new Promise((resolve, reject) => {
    db.get(sql, [CPF, email], (err, row) => {
      if(err){
        console.log(err);
        reject(new SQLError('Ocorreu um erro ao verificar a existência do usuário. Por favor, tente novamente mais tarde.'));
      } else {
        resolve(row !== undefined);
      }
    });
  });
}

module.exports = existsUser;