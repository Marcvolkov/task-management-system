// routes/analyticsRoutes.js - Роуты для аналитики
const express = require('express');
const router = express.Router();
const { getProductivityInsights } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

// Получить инсайты продуктивности
router.get('/insights', protect, getProductivityInsights);

module.exports = router; 