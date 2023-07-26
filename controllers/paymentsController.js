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
}).fields([
  { name: 'buktiTransfer', maxCount: 1 },
  { name: 'fotoMitra', maxCount: 1 },
]);

const createPayment = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      // Use the 'err' parameter instead of 'error'
      console.error(err);
      return res.status(400).json({ error: err.message });
    }

    const {
      namaMitra, 
      namaPelanggan, 
      alamatPelanggan, 
      alamatMitra, 
      startedAt, 
      endedAt, 
      totalHarga, 
      durasi } = req.body;

      const buktiTransferFile = req.files['buktiTransfer'][0];
      const fotoMitraFile = req.files['fotoMitra'][0]; 
      
      const buktiTransferPath = buktiTransferFile ? buktiTransferFile.path : '';
      const fotoMitraPath = fotoMitraFile ? fotoMitraFile.path : '';
      

    // Check if totalHarga is a valid number (you can add more validation if needed)
    if (isNaN(totalHarga)) {
      return res.status(400).json({ message: 'Invalid totalHarga value.' });
    }

    // Gunakan moment untuk menghasilkan tanggal saat ini
    const tanggalTransfer = moment().toDate();

    try {
      const payment = new Payment({
        namaPelanggan, 
        namaMitra, 
        alamatPelanggan, 
        alamatMitra, 
        startedAt, 
        endedAt,
        durasi,
        tanggalTransfer,
        totalHarga,
        fotoMitra: fotoMitraPath,
        buktiTransfer: buktiTransferPath,
      });

      const savedPayment = await payment.save();

      res.status(201).json(savedPayment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message });
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

const updatePaymentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Find the payment by ID
    const payment = await Payment.findById(id);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Update the payment status
    payment.status = status;
    
    // Save the updated payment
    const updatedPayment = await payment.save();

    res.json(updatedPayment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update payment status' });
  }
};

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePaymentStatus,
};
