require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Mitra = require('../models/MitraModel');

// Multer Configuration
const multer = require('multer');
const path = require('path');

// Storage Engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File Filter
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'));
  }
};

// Upload Middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
  fileFilter: fileFilter,
}).single('foto');

// Login Functionality
const loginMitra = async (req, res) => {
  try {
    const { email, password } = req.body;

    const mitra = await Mitra.findOne({ email });

    if (!mitra) {
      return res.status(404).json({ error: 'Mitra not found' });
    }

    const isPasswordMatch = await bcrypt.compare(password, mitra.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const tokenPlayload = {
      id: mitra.id,
      name: mitra.name,
      address: mitra.address,
      email: mitra.email,
      phoneNumber: mitra.phoneNumber,
      foto : mitra.foto,
      deskripsi: mitra.deskripsi,
      salary: mitra.salary,
      category: mitra.category,
      date: mitra.date
    }

    const token = jwt.sign(tokenPlayload, process.env.ACC_TOKEN, { expiresIn: '1h' });

      res.status(200).json({
      token,
      id: mitra.id,
      name: mitra.name,
      address: mitra.address,
      email: mitra.email,
      phoneNumber: mitra.phoneNumber,
      foto : mitra.foto,
      deskripsi: mitra.deskripsi,
      salary: mitra.salary,
      category: mitra.category,
      date: mitra.date
      })
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

// Register Functionality
const registerMitra = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: err.message });
    }
    try {
      const { date, name, email, address, phoneNumber, password, deskripsi, category, salary } = req.body;

      const existingMitra = await Mitra.findOne({ email });
      if (existingMitra) {
        return res.status(409).json({ error: 'Email already exists' });
      }

      const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');

      const hashedPassword = await bcrypt.hash(password, 10);

      const formattedSalary = salary.replace(/,/g, '').replace(/\./g, '');
      
      const mitra = new Mitra({
        date: new Date(date),
        name,
        email,
        address,
        phoneNumber: cleanedPhoneNumber,
        password: hashedPassword,
        deskripsi,
        category,
        salary: formattedSalary, 
        foto: req.file.filename, 
      });

      const savedMitra = await mitra.save();

      const token = jwt.sign({ id: savedMitra._id }, process.env.ACC_TOKEN, { expiresIn: '1h' });

      res.status(201).json({ token, mitra: savedMitra });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: error.message });
    }
  });
};

// Get all Mitra
const getMitras = async (req, res) => {
  try {
    const mitras = await Mitra.find({}).sort({ createdAt: -1 });
    res.status(200).json(mitras);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a single Mitra
const getMitra = async (req, res) => {
  try {
    const { id } = req.params;
    const mitra = await Mitra.findById(id);
    if (!mitra) {
      return res.status(404).json({ error: 'No such Mitra' });
    }
    res.status(200).json(mitra);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a Mitra
const deleteMitra = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'No such Mitra' });
    }

    const mitra = await Mitra.findOneAndDelete({ _id: id });

    if (!mitra) {
      return res.status(404).json({ error: 'No such Mitra' });
    }

    res.status(200).json(mitra);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a Mitra
const updateMitra = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error });
    }

    const mitra = await Mitra.findByIdAndUpdate(id, req.body, { new: true });

    if (!mitra) {
      return res.status(404).json({ error });
    }

    res.status(200).json(mitra);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateStatusMitra = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'No such Mitra' });
    }

    const mitra = await Mitra.findByIdAndUpdate(id, { status }, { new: true });

    if (!mitra) {
      return res.status(404).json({ error: 'No such Mitra' });
    }

    res.status(200).json(mitra);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  loginMitra,
  registerMitra,
  getMitras,
  getMitra,
  deleteMitra,
  updateMitra,
  updateStatusMitra,
};
