// FOLDER NAME controllers FILE NAME pelangganController.js
require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Pelanggan = require('../models/pelangganModel');

const getPelanggans = async (req, res) => {
  try {
    const pelanggans = await Pelanggan.find({}).sort({ createdAt: -1 });
    res.status(200).json(pelanggans);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getPelanggan = async (req, res) => {
  try {
    const { id } = req.params;
    const pelanggan = await Pelanggan.findById(id);
    if (!pelanggan) {
      return res.status(404).json({ error: 'Pelanggan not found' });
    }
    res.status(200).json(pelanggan);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const registerPelanggan = async (req, res) => {
  try {
    const {
      date,
      name,
      email,
      address,
      phoneNumber,
      password,
    } = req.body;

    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
    const hashedPassword = await bcrypt.hash(password, 10);

    const pelanggan = await Pelanggan.create({
      date: new Date(date),
      name,
      email,
      address,
      phoneNumber: cleanedPhoneNumber,
      password: hashedPassword,
    });

    const token = jwt.sign({ pelangganId: pelanggan._id }, process.env.ACC_TOKEN, { expiresIn: '1h' });

    res.status(201).json({ pelanggan, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginPelanggan = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the pelanggan by email
    const pelanggan = await Pelanggan.findOne({ email });

    if (!pelanggan) {
      // Pelanggan not found
      return res.status(404).json({ error: 'Pelanggan not found' });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, pelanggan.password);

    if (!isPasswordValid) {
      // Invalid password
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate the access token
    const tokenPayload = {
      id: pelanggan._id,
      name: pelanggan.name,
      address: pelanggan.address,
      email: pelanggan.email,
      phoneNumber: pelanggan.phoneNumber
    };

    const token = jwt.sign(tokenPayload, process.env.ACC_TOKEN, { expiresIn: '1h' });

    res.status(200).json({
      token,
      pelanggan_id: pelanggan._id,
      name: pelanggan.name,
      address: pelanggan.address,
      email: pelanggan.email,
      phoneNumber: pelanggan.phoneNumber
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePelanggan = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Pelanggan not found' });
    }

    const pelanggan = await Pelanggan.findOneAndDelete({ _id: id });

    if (!pelanggan) {
      return res.status(404).json({ error: 'Pelanggan not found' });
    }

    res.status(200).json(pelanggan);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updatePelanggan = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Pelanggan not found' });
    }

    const pelanggan = await Pelanggan.findByIdAndUpdate(id, req.body, { new: true });

    if (!pelanggan) {
      return res.status(404).json({ error: 'Pelanggan not found' });
    }

    res.status(200).json(pelanggan);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getPelanggans,
  getPelanggan,
  registerPelanggan, 
  loginPelanggan, 
  deletePelanggan,
  updatePelanggan,
};
