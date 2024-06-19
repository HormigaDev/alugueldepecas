SELECT
  u.id AS autor,
  a.id_ferramenta AS id_anuncio,
  f.nome AS title,
  f.descricao AS description,
  f.valor AS price
FROM anuncios a
INNER JOIN ferramentas f ON a.id_ferramenta = f.id
INNER JOIN users u ON a.id_usuario = u.id
WHERE (LOWER(f.nome) LIKE '%' || LOWER(?) || '%' OR LOWER(f.descricao) LIKE '%' || LOWER(?) || '%')
AND a.disponibilidade = 1;