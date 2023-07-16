// FOLDER NAME controllers FILE NAME AdminController.js 

require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/AdminModel');

// Register a new admin
const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the admin already exists
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(409).json({ error: 'Admin already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin
    const admin = new Admin({
      email,
      password: hashedPassword,
    });

    // Save the admin to the database
    await admin.save();

    res.status(201).json(admin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Login admin
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if the admin exists
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ email: admin.email }, process.env.ACC_TOKEN, {
      expiresIn: '1h', // Token expiration time
    });

    // Return the token to the client
    res.status(200).json({ token, admin_id: admin._id});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Get all admins
const getAllAdmins = async (req, res) => {
  try {
    // Retrieve all admins from the database
    const admins = await Admin.find();

    res.json(admins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Get a single admin by ID
const getAdminById = async (req, res) => {
  const { id } = req.params;

  try {
    // Retrieve the admin by ID from the database
    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.json(admin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Update an admin
const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;

  try {
    // Check if the admin exists
    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Hash the new password if provided
    let updatedPassword;
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }

    // Update the admin's email and password
    admin.email = email || admin.email;
    admin.password = updatedPassword || admin.password;

    // Save the updated admin to the database
    await admin.save();

    res.json(admin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Delete an admin
const deleteAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the admin exists
    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Delete the admin from the database
    await admin.remove();

    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports = {
  register,
  login,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};
