const { desencriptar } = require('./crypto');
const db = require('../database');

function authenticate(req, res, next){
  let exception = ['login', 'criar-usuario'];
  if(exception.includes(req.path.replace('/', ''))){
    return next();
  }
  if(!req.headers.authorization){
    return res.status(401).send({message: 'Token não informado'});
  }
  let token = req.headers.authorization.split(' ')[1];
  try {
    let payload = desencriptar(token);
    db.get('SELECT id FROM users where id = ?', payload?.userId, (err, row) => {
      if(err){
        return res.status(401).send({message: 'Token inválido'});
      } else {
        req.userId = row.id;
        return next();
      }
    })
  } catch(err){
    return res.status(401).send({message: 'Token inválido'});
  }
}

module.exports = { authenticate };