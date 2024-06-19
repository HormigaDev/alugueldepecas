SELECT
  u.id AS id_autor,
  u.nome AS nome_autor,
  f.nome AS titulo,
  f.descricao AS descricao,
  f.valor AS valor,
  f.id AS id_ferramenta,
  a.localizacao AS localizacao,
  a.detalhes AS detalhes
FROM anuncios a
INNER JOIN ferramentas f ON a.id_ferramenta = f.id
INNER JOIN users u ON a.id_usuario = u.id
WHERE a.id_ferramenta = ?;