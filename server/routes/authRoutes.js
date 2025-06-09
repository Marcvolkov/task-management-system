// routes/authRoutes.js - Роуты для аутентификации
const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Публичные роуты (не требуют аутентификации)
router.post('/register', register);
router.post('/login', login);

// Защищенные роуты (требуют токен)
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;