const express = require('express')
const {
    getPelanggans,
    getPelanggan,    
    createPelanggan,
    deletePelanggan,
    updatePelanggan
} = require('../controllers/pelangganController')

const router = express.Router()

// GET all Pelanggan
router.get('/', getPelanggans)

// GET a single Pelanggan
router.get('/:id', getPelanggan)

// POST a new Pelanggan
router.post('/', createPelanggan)

// DELETE a Pelanggan
router.delete('/:id', deletePelanggan)

// UPDATE a Pelanggan
router.patch('/:id', updatePelanggan)

module.exports = router