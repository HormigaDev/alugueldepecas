const db = require('../../database');
const SQLError = require('../../utils/SQLError');

function userInfo(userId){
  const sql = db.read('select', 'user_info');
  return new Promise((resolve, reject) => {
    db.get(sql, [userId], (err, row) => {
      if(err){
        console.log(err);
        reject(new SQLError('Erro interno do servidor. Por favor tente mais tarde'));
      } else {
        resolve(row);
      }
    });
  });
}

module.exports = userInfo;