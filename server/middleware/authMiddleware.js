// middleware/authMiddleware.js - Middleware для проверки аутентификации
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware для защиты роутов
const protect = async (req, res, next) => {
  let token;

  // Проверяем наличие токена в заголовке Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Извлекаем токен из заголовка
      // Формат: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      token = req.headers.authorization.split(' ')[1];

      // Верифицируем токен
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Находим пользователя по ID из токена
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return res.status(401).json({ 
          error: 'User not found' 
        });
      }

      // Переходим к следующему middleware или роуту
      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      
      // Различные типы ошибок JWT
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          error: 'Invalid token' 
        });
      }
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          error: 'Token expired' 
        });
      }

      return res.status(401).json({ 
        error: 'Not authorized' 
      });
    }
  }

  // Если токена нет
  if (!token) {
    return res.status(401).json({ 
      error: 'Not authorized, no token' 
    });
  }
};

// Функция для генерации JWT токена
const generateToken = (id) => {
  return jwt.sign(
    { id }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

module.exports = { protect, generateToken };