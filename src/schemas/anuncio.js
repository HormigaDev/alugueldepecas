module.export = {
  nome: {
    type: 'string',
    limit: [2, 30],
  },
  descricao: {
    type: 'string',
    limit: [1, 400]
  },
  detalhes: {
    type: 'string',
    limit: [1, 3000]
  },
  valor: {
    type: 'number',
    limit: [0.1, 999999]
  },
  localizacao: {
    type: 'string',
    limit: [3, 300]
  },
  disponibilidade: {
    type: 'number',
    rules: [
      {
        name: 'Deve ser um número inteiro binário (0 ou 1)',
        rule: (value) => {
          return value === 0 || value === 1;
        }
      }
    ]
  }
}