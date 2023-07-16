const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mitraSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Added unique constraint for email
    },
    address: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    deskripsi: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
      required: true,
    },
    foto: {
      type: String,
      required: true,
    },
    status: {
        type: String,
        enum: ['Available', 'Unvailable'],
        default: 'Unvailable',
      },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Mitra', mitraSchema);
