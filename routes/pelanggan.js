// FOLDER NAME ROUTES FILE NAME pelanggan.js
const express = require('express');
const {
  getPelanggans,
  getPelanggan,
  registerPelanggan, 
  loginPelanggan, 
  deletePelanggan,
  updatePelanggan,
} = require('../controllers/pelangganController');

const router = express.Router();

// GET all Pelanggan
router.get('/', getPelanggans);

// GET a single Pelanggan
router.get('/:id', getPelanggan);

// POST register
router.post('/register', registerPelanggan);

// POST login
router.post('/login', loginPelanggan); // Add login route

// DELETE a Pelanggan
router.delete('/:id', deletePelanggan);

// UPDATE a Pelanggan
router.patch('/:id', updatePelanggan);

module.exports = router;
