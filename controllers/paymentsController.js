const Payment = require('../models/paymentsModel');

// Controller untuk membuat pembayaran baru
exports.createPayment = (req, res) => {
  // Dapatkan data dari permintaan
  const { items, deliveryLocation, paymentMethod, subtotal, appFee, discount, total } = req.body;

  // Buat objek Payment baru
  const payment = new Payment({
    items,
    deliveryLocation,
    paymentMethod,
    subtotal,
    appFee,
    discount,
    total,
  });

  // Simpan pembayaran ke database
  payment.save()
    .then(() => {
      // Pembayaran berhasil disimpan
      res.json({ message: 'Payment successful' });
    })
    .catch((error) => {
      console.error(error);
      // Terjadi kesalahan saat menyimpan pembayaran
      res.status(500).json({ error: 'An error occurred while processing the payment' });
    });
};
