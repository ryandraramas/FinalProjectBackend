const express = require('express')
const {
    getArts,
    getArt,
    createArt,
    deleteArt,
    updateArt
} = require('../controllers/ARTController')

const router = express.Router()

// GET All Asisten Rumah Tangga
router.get('/', getArts)

// GET a single Asisten Rumah Tangga
router.get('/:id', getArt)

// POST a new Asisten Rumah Tangga
router.post('/', createArt)

// DELETE a Asisten Rumah Tangga
router.delete('/:id', deleteArt)

// UPDATE a Asisten Rumah Tangga
router.patch('/:id', updateArt)

module.exports = router