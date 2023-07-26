const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  // String Name
  namaPelanggan: {
    type: String,
    required: true,
  },
  namaMitra: {
    type: String,
    required: true,
  },
  // String Address
  alamatPelanggan: {
    type: String,
    required: true,
  },
  alamatMitra: {
    type: String,
    required: true,
  },
  // String starttoend
  startedAt: {
    type: String,
    required: true,
  },
  endedAt: {
    type: String,
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
  // Number of total
  totalHarga: {
    type: Number,
    required: true,
  },
  fotoMitra: {
    type: String,
    required: true,
  },
  buktiTransfer: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // String Status
  status: {
    type: String,
    enum: ['Pending', 'Terbayarkan'],
    default: 'Pending'
},
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
