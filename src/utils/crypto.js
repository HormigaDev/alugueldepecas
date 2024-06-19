const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

function cifrar(senha){
  return bcrypt.hash(senha, saltRounds);
}

function comparar(senha, hash){
  return bcrypt.compare(senha, hash);
}

function encriptar(payload){
  return jwt.sign(payload, process.env.JWT_TOKEN);
}

function desencriptar(token){
  return jwt.verify(token, process.env.JWT_TOKEN);
}

module.exports = { cifrar, comparar, encriptar, desencriptar };