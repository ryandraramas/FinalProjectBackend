require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const pelangganRoutes = require('./routes/pelanggan');
const mitraRoutes = require('./routes/Mitra');
const jobPostRoutes = require('./routes/JobPost');
const adminRoutes = require('./routes/Admin');

const app = express();

app.use(express.json());
app.use(cors());

// Additional middleware for React Native requests
app.use((req, res, next) => {
  if (req.headers['user-agent'] === 'Your-React-Native-User-Agent') {
    console.log('Request from React Native application');
    // Additional handling for requests from React Native
  } else {
    console.log('Request from other sources');
    // Default handling for requests from other sources
  }
  next();
});

// Connect to the MongoDB database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Connected to Database & Listening on Port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
    process.exit(1); // Terminate the application if unable to connect to the database
  });

// Routes
app.use('/api/pelanggan', pelangganRoutes); // Routes for pelanggan
app.use('/api/mitra', mitraRoutes); // Routes for mitra
app.use('/api/mitra/jobPosts', jobPostRoutes); // Routes for job posts
app.use('/api/admin', adminRoutes); // Routes for admin

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

// Handle unhandled rejections and uncaught exceptions
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
