const express = require('express');
const {
  loginMitra,
  registerMitra,
  getMitras,
  getMitra,
  deleteMitra,
  updateMitra,
  updateStatusMitra,
  hideMitra,
} = require('../controllers/MitraController');

const router = express.Router();

// GET All Mitra
router.get('/', getMitras);

// Fungsi Login
router.post('/login', loginMitra);

// Fungsi Register
router.post('/register', registerMitra);

// GET a single Mitra
router.get('/:id', getMitra);

// DELETE a Mitra
router.delete('/:id', deleteMitra);

// UPDATE a Mitra
router.patch('/:id', updateMitra);

// UPDATE status of a Mitra
router.patch('/:id/status', updateStatusMitra);

// HIDE a Mitra
router.patch('/:id/hide', hideMitra);

module.exports = router;
