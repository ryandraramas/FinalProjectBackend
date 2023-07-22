const express = require('express');
const router = express.Router();

const paymentController = require('../controllers/paymentsController');

router.post('/', paymentController.createPayment);
router.get('/', paymentController.getAllPayments);
router.get('/:id', paymentController.getPaymentById);

module.exports = router;
