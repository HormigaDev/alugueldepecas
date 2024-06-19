SELECT
  u.nome AS autor,
  f.nome AS ferramenta,
  f.descricao AS descricao,
  f.valor AS valor
FROM anuncios a
INNER JOIN users u ON a.id_usuario = u.id
INNER JOIN ferramentas f ON a.id_ferramenta = f.id
WHERE a.id_ferramenta = ?;