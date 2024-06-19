const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
if(!fs.existsSync(path.join(process.env.ROOT, 'BbelStudio/Apps/AluguelDePecas'))){
  fs.mkdirSync(path.join(process.env.ROOT, 'BbelStudio/Apps/AluguelDePecas'), { recursive: true });
}
const db = new sqlite3.Database(path.join(process.env.ROOT, 'BbelStudio/Apps/AluguelDePecas/database.db'));


db.APP_URL = 'http://localhost:19223';

db.read = (type, name, vars) => {
  const dir = path.resolve(__dirname, 'sql', type, `${name}.sql`);
  let file = fs.readFileSync(dir, { encoding: 'utf-8'});
  if(vars){
    for(const key in vars){
      file = file.replace(new RegExp(`{{${key}}}`, 'g'), vars[key]);
    }
  }
  return file;
}
db.begin = () => {
  return new Promise((resolve) => {
    db.run('begin transaction', (err) => {
      if(err){
        // console.log(err);
        resolve(false);
      }
      resolve(true);
    });
  });
}
db.rollback = () => {
  return new Promise((resolve) => {
    db.run('rollback', (err) => {
      if(err){
        // console.log(err);
        resolve(false);
      }
      resolve(true);
    });
  });
}
db.commit = () => {
  return new Promise((resolve) => {
    db.run('commit', (err) => {
      if(err){
        // console.log(err);
        resolve(false);
      }
      resolve(true);
    });
  });
}
db.last_rowid = () => {
  return new Promise((resolve) => {
    db.get('select last_insert_rowid() as id', (err, row) => {
      if(err){
        console.log(err);
        resolve(false);
      }
      resolve(row.id);
    });
  })
}
/**
 * 
 * @param {string} table - El nombre de la tabla 
 * @returns {Promise<number>}
 */
db.total = (table, conditions='', joins) => {
  return new Promise((resolve, reject) => {
    const sql = `select count(*) as total from ${table} ${table[0]} ${joins?joins.join("\n\r"):''} ${conditions??''}`;
    // console.log(sql);
    db.get(sql, (err, row) => {
      if(err){
        console.log(err);
        return undefined;
      } else {
        resolve(row.total);
      }
    })
  })
}

function createTables(){
  return new Promise((resolve) => {
    db.serialize(async () => {
      await db.begin();
      db.exec(db.read('create', 'database'), async (err) => {
        if(err){
          // console.error(err);
          await db.rollback();
          resolve(false);
        } else {
          await db.commit();
          resolve(true);
        }
      });
    });
  })
}

async function createDatabase(){
  await createTables();
}
db.createDatabase = createDatabase;

module.exports = db;