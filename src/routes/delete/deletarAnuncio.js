const db = require('../../database');

const verificarAnuncio = require('../functions/verificarAnuncio');

module.exports = {
  path: '/excluir-anuncio/:id_ferramenta',
  async handler(req, res){
    try {
      const userId = req.userId;
      let id_ferramenta = req.params.id_ferramenta;
      if(!id_ferramenta){
        console.log(id_ferramenta);
        return res.status(400).json({message: "ID da ferramenta não informado"});
      }
      id_ferramenta = parseInt(id_ferramenta);
      if(isNaN(id_ferramenta)){
        return res.status(400).json({message: "ID da ferramenta inválido"});
      }
      const existe = await verificarAnuncio(userId, id_ferramenta);
      if(!existe) {
        return res.status(400).json({message: "Anúncio não encontrado ou não pertence ao usuário"});
      }
      const sqlAnuncio = db.read('delete', 'anuncio');
      const sqlFerramenta = db.read('delete', 'ferramenta');
      const sqlImagens = db.read('delete', 'imagens_ferramenta');

      db.serialize(async () => {
        try{
          await db.begin();
          db.run(sqlAnuncio, [id_ferramenta], (err) => {
            if(err){
              throw err;
            } else {
              db.run(sqlImagens, [id_ferramenta], (err) => {
                if(err){
                  throw err;
                } else {
                  db.run(sqlFerramenta, [id_ferramenta], async (err) => {
                    if(err){
                      throw err;
                    }
                    await db.commit();
                    return res.status(200).json({message: "Anúncio excluído com sucesso"});
                  });
                }
              });
            }
          });
        } catch(err){
          await db.rollback();
          console.log(err);
          res.status(500).json({message: "Ocorreu um erro inesperado"});
        }
      })

    } catch(err){
      console.log(err);
      res.status(500).json({message: "Ocorreu um erro inesperado"})
    }
  }
}