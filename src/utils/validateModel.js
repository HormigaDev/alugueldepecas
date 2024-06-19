const ValidationError = require('./ValidationError');

/**
 * 
 * @param {object} model O modelo a validar
 * @param {object} schema O esquema a seguir
 * @returns {boolean} true se o modelo é válido, false se não
 * @throws {ValidationError} O erro de validação
 */
function validateModel(model, schema){
  if(!model || !schema) throw new ValidationError('O modelo e o esquema são obrigatórios');
  if(typeof model !== 'object' || Array.isArray(model)) throw new ValidationError('O modelo deve ser um objeto');
  if(typeof schema !== 'object' || Array.isArray(schema)) throw new ValidationError('O esquema deve ser um objeto');
  for(const key in schema){
    if(model[key] === undefined) throw new ValidationError(`A propriedade "${key}" não existe no objeto informado.`);
    const obj = schema[key];
    if(obj.type){
      if(Array.isArray(obj.type)){
        const type = obj.type[0];
        if(!Array.isArray(model[key])) throw new ValidationError(`A propriedade "${key}" deve ser um array do tipo ${type}`)
        if(!obj.acceptNull && model[key].length === 0) throw new ValidationError(`A propriedade '${key}' não pode ser uma lista vazia.`);
        for(const item of model[key]){
          if(typeof item !== type) throw new ValidationError(`Foi encontrado um elemento em "${key}" que não é do tipo ${type}. Tipo: ${typeof item} Valor: ${item}`)
        }
      } else {
        if(typeof model[key] !== obj.type) throw new ValidationError(`A propriedade "${key}" deve ser do tipo ${obj.type}. Tipo informado: ${typeof model[key]} Valor: ${model[key]}`)
      }
    }
    if(obj.limit){
      if(Array.isArray(obj.limit)){
        if(model[key].length < obj.limit[0]) throw new ValidationError(`O mínimo de caracteres/elementos para a propriedade "${key}" é ${obj.limit[0]}.`);
        if(model[key].length > obj.limit[1]) throw new ValidationError(`O máximo de caracteres/elementos para a propriedade "${key}" é ${obj.limit[1]}.`);
      }
      if(typeof obj.limit === 'number'){
        if(model[key].length > obj.limit) throw new ValidationError(`O máximo de caracteres para a propriedade "${key}" é ${obj.limit}.`);
      }
    }
    if(obj.rules !== undefined && Array.isArray(obj.rules)){
      for(let rl of obj.rules){
        if(rl.name && rl.rule){
          if(rl.rule(model[key]) === false) throw new ValidationError(`A propriedade "${key}" falhou na regra "${rl.name}"`);
        } else {
          if(rl(model[key]) === false) throw new ValidationError(`A propriedade "${key}" falhou em uma ou mais regras.`);
        }
      }
    }
  }
  return true;
}

module.exports = validateModel;
