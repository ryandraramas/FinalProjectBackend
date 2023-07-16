// FOLDER NAME ROUTES FILE NAME admin.js
// Admin.js
const express = require('express');
const router = express.Router();

const adminController = require('../controllers/AdminController');

// Register a new admin
router.post('/register', adminController.register);

// Login admin
router.post('/login', adminController.login);

// Get all admins
router.get('/', adminController.getAllAdmins);

// Get a single admin by ID
router.get('/:id', adminController.getAdminById);

// Update an admin
router.patch('/:id', adminController.updateAdmin);

// Delete an admin
router.delete('/:id', adminController.deleteAdmin);

module.exports = router;
