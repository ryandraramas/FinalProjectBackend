const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  buktiTransfer: {
    type: String,
    required: true,
  },
  totalHarga: {
    type: Number,
    required: true,
  },
  durasi: {
    type: String,
    required: true,
  },
  tanggalTransfer: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
