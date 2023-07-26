const express = require('express');
const router = express.Router();

const paymentController = require('../controllers/paymentsController');

router.post('/', paymentController.createPayment);
router.get('/', paymentController.getAllPayments);
router.get('/:id', paymentController.getPaymentById);
router.patch('/:id/status', paymentController.updatePaymentStatus)

module.exports = router;
