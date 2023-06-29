require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors') // Import the cors middleware

const pelangganRoutes = require('./routes/pelanggan')
// const paymentsRoutes = req('./routes/payments')

const artRoutes = require('./routes/ART')
const jobPostRoutes = require('./routes/JobPost');

// express app
const app = express()

// middleware
app.use(express.json())

app.use((req, res, next) => {
  if (req.headers['user-agent'] === 'Your-React-Native-User-Agent') {
    console.log('Request from React Native application')
    // Additional handling for requests from React Native
  } else {
    console.log('Request from other sources')
    // Default handling for requests from other sources
  }
  next()
})

// Enable CORS for all routes
app.use(cors())

// routes
app.use('/api/pelanggan', pelangganRoutes)
// app.use('/api/pelanggan/payments', paymentsRoutes)

app.use('/api/AsistenRumahTangga', artRoutes)
app.use('/api/AsistenRumahTangga/JobPost', jobPostRoutes);


// connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // listening for requests
    app.listen(process.env.PORT, () => {
      console.log('Connected to Database & Listening on Port', process.env.PORT)
    })
  })
  .catch((error) => {
    console.log(error)
  })

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong' })
})
