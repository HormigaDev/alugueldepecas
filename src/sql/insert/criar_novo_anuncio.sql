INSERT INTO anuncios (
  id_usuario,
  id_ferramenta,
  data_criacao,
  detalhes,
  localizacao,
  disponibilidade
) VALUES (?, ?, DATETIME('now'), ?, ?, ?);