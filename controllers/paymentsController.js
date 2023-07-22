const Payment = require('../models/paymentsModel');
const multer = require('multer');
const path = require('path');
const moment = require('moment'); // Import Moment package

// Konfigurasi multer untuk menyimpan file di folder "uploads"
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

// Membuat middleware multer untuk memproses upload file
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // Batas ukuran file 5 MB
  },
  fileFilter: function (req, file, cb) {
    // Hanya menerima file gambar dengan ekstensi .png, .jpg, atau .jpeg
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'));
    }
  },
}).single('buktiTransfer');

const createPayment = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const { totalHarga, durasi } = req.body;
    const buktiTransfer = req.file ? req.file.path : '';

    // Gunakan moment untuk menghasilkan tanggal saat ini
    const tanggalTransfer = moment().toDate();

    try {
      const payment = new Payment({
        buktiTransfer,
        totalHarga,
        durasi,
        tanggalTransfer,
      });

      const savedPayment = await payment.save();

      res.status(201).json(savedPayment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create payment' });
    }
  });
};

const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: 'desc' });
    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch payments' });
  }
};

const getPaymentById = async (req, res) => {
  const { id } = req.params;

  try {
    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch payment' });
  }
};

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById,
};
