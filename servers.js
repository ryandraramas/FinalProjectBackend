const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const pelangganRoutes = require('./routes/pelanggan');
const mitraRoutes = require('./routes/Mitra');
const jobPostRoutes = require('./routes/jobPost');
const adminRoutes = require('./routes/admin');
const paymentsRoutes = require('./routes/payments');

const app = express();

app.use(express.static('uploads'));
app.use(express.json());
app.use(cors());

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
app.use('/api/pelanggan', pelangganRoutes);
app.use('/api/mitra', mitraRoutes);
app.use('/api/mitra/jobPosts', jobPostRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentsRoutes); // Correct the path for paymentsRoutes

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
