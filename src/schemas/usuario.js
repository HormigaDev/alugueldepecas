module.exports = {
  nome: {
    type: 'string',
    limit: [3, 30],
    rules: [
      {
        name: 'Somente caracteres alfabéticos e espaços',
        rule: (value) => /^[a-zA-Z\s]+$/.test(value)
      }
    ]
  },
  CPF: {
    type: 'string',
    limit: 11,
    rules: [
      {
        name: 'Somente números',
        rule: (value) => /^[0-9]+$/.test(value)
      }
    ]
  },
  email: {
    type: 'string',
    limit: [5, 50],
    rules: [
      {
        name: 'Email válido',
        rule: (value) => /\S+@\S+\.\S+/.test(value)
      }
    ]
  },
  telefone: {
    type: 'string',
    limit: [10, 11],
    rules: [
      {
        name: 'Somente números',
        rule: (value) => /^[0-9]+$/.test(value)
      }
    ]
  },
  endereco: {
    type: 'string',
    limit: [5, 50]
  },
  bairro: {
    type: 'string',
    limit: [5, 50]
  },
  cep: {
    type: 'string',
    limit: 8,
    rules: [
      {
        name: 'Somente números',
        rule: (value) => /^[0-9]+$/.test(value)
      }
    ]
  },
  senha: {
    type: 'string',
    limit: [8, 30],
    rules: [
      {
        name: 'Senha forte',
        rule: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)
      }
    ]
  }
}