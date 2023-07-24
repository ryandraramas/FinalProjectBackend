const multer = require('multer');
const path = require('path');
const Notification = require('../models/NotificationModel');

// Konfigurasi multer untuk mengunggah gambar
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

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

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
  fileFilter: fileFilter,
}).single('gambarPromo');

// Controller untuk membuat notifikasi baru
const createNotification = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error uploading file' });
    }

    const { syaratKetentuan, deskripsiPromo } = req.body;

    const gambar = req.file ? req.file.filename : null;
      if (!gambar) {
        return res.status(400).json({ error: 'Image is required' });
      }

    const newNotification = new Notification({
      gambar,
      syaratKetentuan,
      deskripsiPromo,
    });

    newNotification.save()
      .then((notification) => {
        res.status(201).json(notification);
      })
      .catch((error) => {
        res.status(500).json({ error });
      });
  });
};

// Controller untuk mendapatkan semua notifikasi
const getAllNotifications = (req, res) => {
  Notification.find()
    .sort({ createdAt: -1 })
    .then((notifications) => {
      res.json(notifications);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error fetching notifications' });
    });
};

const updateNotification = (req, res) => {
  const { id } = req.params;
  const { syaratKetentuan, deskripsiPromo } = req.body;
  
  // Optional: Check if the image is being updated
  if (req.file) {
    const gambar = req.file.path;
    Notification.findByIdAndUpdate(id, { gambar, syaratKetentuan, deskripsiPromo }, { new: true })
      .then((notification) => {
        if (!notification) {
          return res.status(404).json({ error: 'Notification not found' });
        }
        res.json(notification);
      })
      .catch((error) => {
        res.status(500).json({ error: 'Error updating notification' });
      });
  } else {
    // If image is not being updated, only update the other fields
    Notification.findByIdAndUpdate(id, { syaratKetentuan, deskripsiPromo }, { new: true })
      .then((notification) => {
        if (!notification) {
          return res.status(404).json({ error: 'Notification not found' });
        }
        res.json(notification);
      })
      .catch((error) => {
        res.status(500).json({ error: 'Error updating notification' });
      });
  }
};

// Controller untuk menghapus notifikasi berdasarkan ID
const deleteNotification = (req, res) => {
  const { id } = req.params;

  Notification.findByIdAndDelete(id)
    .then(() => {
      res.json({ message: 'Notification deleted successfully' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error deleting notification' });
    });
};

module.exports = {
  createNotification,
  getAllNotifications,
  deleteNotification,
  updateNotification, 
};
