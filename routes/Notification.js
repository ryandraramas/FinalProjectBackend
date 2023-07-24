const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/NotificationControllers');

// Endpoint untuk membuat notifikasi baru
router.post('/', notificationController.createNotification);

// Endpoint untuk mendapatkan semua notifikasi
router.get('/', notificationController.getAllNotifications);

// Endpoint untuk menghapus notifikasi berdasarkan ID
router.delete('/:id', notificationController.deleteNotification);

// Endpoint untuk mengupdate notifikasi berdasarkan ID
router.patch('/:id', notificationController.updateNotification);

module.exports = router;
