const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/paymentsController');

// Create a new payment
router.post('/api/pelanggan/payments', paymentsController.createPayment);

// Delete a payment
router.delete('/api/pelanggan/payments/:paymentId', paymentsController.deletePayment);

// Get all payments
router.get('/api/pelanggan/payments', paymentsController.getAllPayments);

// Get a single payment
router.get('/api/pelanggan/payments/:paymentId', paymentsController.getPayment);

module.exports = router;