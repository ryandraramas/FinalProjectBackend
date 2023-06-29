const mongoose = require('mongoose');

// Definisikan skema untuk pembayaran
const paymentSchema = new mongoose.Schema({
  items: { 
    type: String, 
    required: true 
},
  deliveryLocation: { 
    type: String, 
    required: true 
},
  paymentMethod: { 
    type: String, 
    required: true 
},
  subtotal: { 
    type: Number,
    required: true 
},
  appFee: { 
    type: Number, 
    required: true 
},
  discount: { 
    type: Number, 
    required: true
},
  total: { 
    type: Number, 
    required: true 
},
});

// Buat model Payment menggunakan skema yang telah didefinisikan
const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
