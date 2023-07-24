const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  gambar: {
    type: String,
    required: true,
  },
  syaratKetentuan: {
    type: String,
    required: true,
  },
  deskripsiPromo: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
