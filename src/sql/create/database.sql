CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome VARCHAR(30),
  cpf VARCHAR(11),
  email VARCHAR(50),
  telefone VARCHAR(12),
  endereco VARCHAR(50),
  cep VARCHAR(8),
  bairro VARCHAR(20),
  senha VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS ferramentas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  descricao VARCHAR(400),
  nome VARCHAR(30),
  valor FLOAT,
  id_usuario INTEGER NOT NULL,
  FOREIGN KEY (id_usuario) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS imagens (
  id_ferramenta INTEGER NOT NULL,
  imagem text,
  FOREIGN KEY (id_ferramenta) REFERENCES ferramentas(id)
);

CREATE TABLE IF NOT EXISTS anuncios (
  id_usuario INTEGER NOT NULL,
  id_ferramenta INTEGER NOT NULL,
  data_criacao TIMESTAMP NOT NULL,
  detalhes VARCHAR(3000),
  localizacao VARCHAR(300),
  disponibilidade INTEGER DEFAULT 1,
  PRIMARY KEY (id_usuario, id_ferramenta),
  FOREIGN KEY (id_usuario) REFERENCES users(id),
  FOREIGN KEY (id_ferramenta) REFERENCES ferramentas(id)
);

CREATE TABLE IF NOT EXISTS pedidos (
  id_anuncio INTEGER NOT NULL,
  id_usuario INTEGER NOT NULL,
  data_pedido TIMESTAMP NOT NULL,
  status_pedido VARCHAR(20),
  data_fim_aluguel TIMESTAMP,
  PRIMARY KEY (id_anuncio, id_usuario),
  FOREIGN KEY (id_anuncio) REFERENCES anuncios(id_ferramenta),
  FOREIGN KEY (id_usuario) REFERENCES users(id)
);