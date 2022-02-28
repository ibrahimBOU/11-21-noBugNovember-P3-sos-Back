// INSERT INTO sous_categories (nom_sous_categorie, categorie_id)
// VALUES (?, ?);

const express = require('express')
const router = express.Router()
const mysql = require('../config/db')

// Routes GET
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM sous_categories'
  mysql.query(sql, (err, result) => {
    if (err) {
      res.status(500).send('Error retrieving data from sous_categorie')
      console.error(err)
    } else {
      console.table(result)
      res.status(200).json(result)
    }
  })
})

// Routes POST

router.post('/', (req, res) => {
  const { nom_sous_categorie, categorie_id } = req.body
  sql =
    'INSERT INTO sous_categories (nom_sous_categorie, categorie_id) VALUES (?,?);'

  mysql.query(sql, [nom_sous_categorie, categorie_id], (err, result) => {
    if (err) {
      res.status(500).send('Error saving sous_categorie')
    } else {
      console.log(result)
      const id = result.insertId
      const createdSousCategorie = { id, nom_sous_categorie, categorie_id }
      res.status(201).json(createdSousCategorie)
    }
  })
})

router.delete('/:id', (req, res) => {
  const sousCatId = req.params.id
  mysql.query(
    'DELETE FROM sous_categories WHERE id_sous_categorie=?',
    [sousCatId],
    (err, result) => {
      if (err) {
        console.log(err)
        res.status(500).send('Error deleting a sous-categorie')
      } else {
        if (result.affectedRows) res.status(200).send('🎉 SousCat deleted!')
        else res.status(404).send('SousCat not found.')
      }
    }
  )
})
module.exports = router