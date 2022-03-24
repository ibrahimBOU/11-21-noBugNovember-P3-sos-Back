const connection = require('../config/db')
const Joi = require('joi')

const db = connection.promise()

// const validate = (data, forCreation = true) => {
//     const presence = forCreation ? 'require': 'optional'
//     return Joi.object({
//         nom_ville: Joi.string().max(100).presence(presence),
//         region_id: Joi.number().integer().presence(presence)
//     }).validate(data, { abortEarly: false}).error
// }

const validate = (data, forCreation = true) => {
  const presence = forCreation ? 'required' : 'optional'
  return Joi.object({
    nom_ville: Joi.string().max(255).presence(presence),
    region_id: Joi.number().presence(presence)
  }).validate(data, { abortEarly: false }).error
}

// READ ALL
const findMany = ({ filters: { region } }) => {
  const sqlValues = []
  let filter = ''
  if (region) {
    filter += 'WHERE region_id=?'
    sqlValues.push(parseInt(region))
  }
  let sql = `SELECT id_ville, nom_ville,region_id, nom_region FROM villes LEFT JOIN regions ON id_region = region_id ${filter}`
  return db
  .query(sql, sqlValues)
  .then(([result]) => result)
}

//READ ALL CITIES     === MIS DE COTE ***
// const findMany = ({ filters: { regions, region } }) => {
//   let sql =
//     'SELECT * FROM villes INNER JOIN regions reg on villes.region_id = reg.id_region'
//   const sqlValues = []

//   return db.query(sql, sqlValues).then(([results]) => results)} /********* FIN MIS DE COTE  */

//READ ALL CITIES AND REGIONS
// const findMany2 = () => {
//     return db.query( 'SELECT * FROM villes vil  INNER JOIN regions reg on vil.region_id = reg.id_region')
//     .then(([result])=>result)
// }

//READ ALL BY REGION
// const findMany3 = (id) => {
//     const sql = 'SELECT * FROM villes vil  INNER JOIN regions reg on vil.region_id = reg.id_region WHERE region_id = ?'
//     return db.query(sql, [id])
//     .then(([result])=>result)
// }

//READ ONE
const findOne = id => {
  const sql = 'SELECT * FROM villes WHERE id_ville =?'
  return db.query(sql, [id]).then(([result]) => result[0])
}

//READ ONE AND REGION
// const findOne2 = id => {
//     const sql = 'SELECT * FROM villes vil INNER JOIN region reg ON vil.region_id= reg.id_region WHERE id_ville =?'
//     return db.query(sql,[id])
//     .then(([result]) => result[0])
// }

// const findByEmailWithDifferentId = (email, id) => {
//     return db
//       .query('SELECT * FROM users WHERE email = ? AND id <> ?', [email, id])
//       .then(([results]) => results[0]);
//   };

//POST ONE
const findVille = ({ nom_ville, region_id }) => {
  console.log(nom_ville, region_id, '4')
  const sql = 'SELECT * FROM villes WHERE nom_ville =? AND region_id = ?'
  return db.query(sql, [nom_ville, region_id]).then(([results]) => results[0])
}

const create = ({ nom_ville, region_id }) => {
  const sql = 'INSERT INTO villes (nom_ville, region_id) VALUES (?,?)'
  return db.query(sql, [nom_ville, region_id]).then(([result]) => {
    console.log(result, '3')
    const id = result.insertId
    return { id, nom_ville, region_id }
  })
}

//UPDATE ONE
const update = (id, newAttributes) => {
  return db.query('UPDATE villes SET ? WHERE id_ville= ?', [newAttributes, id])
}

// const findByVillesWithDifferentId = (villes, id) => {
//   return db
//     .query('SELECT * FROM villes WHERE nom_villes = ? AND id_villes <> ?', [
//       villes,
//       id
//     ])
//     .then(([result]) => result[0])
// }

//UPDATE ONE BY REGION
// const update2 = (id, newAttributes) => {
//     return db.query('UPDATE villes SET ? WHERE ')
// }
//DELETE ONE
const destroy = id => {
  return db
    .query('DELETE FROM villes WHERE id_ville = ?', [id])
    .then(([result]) => result.affectedRows !== 0)
}

module.exports = {
  validate,
  findMany,
  findOne,
  findVille,
  create,
  update,
  destroy
  // findByVillesWithDifferentId
}
