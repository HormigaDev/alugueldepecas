SELECT
  a.id_ferramenta as id_anuncio,
  f.nome as title,
  f.descricao as description,
  f.valor as price
FROM anuncios a
INNER JOIN ferramentas f ON a.id_ferramenta = f.id
WHERE (LOWER(f.nome) LIKE '%' || LOWER(?) || '%' OR LOWER(f.descricao) LIKE '%' || LOWER(?) || '%')
AND a.id_usuario = ?;