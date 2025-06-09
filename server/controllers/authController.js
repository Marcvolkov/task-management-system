// controllers/authController.js - Контроллер для аутентификации
const User = require('../models/User');
const { generateToken } = require('../middleware/authMiddleware');

// Регистрация нового пользователя
// POST /api/auth/register
const register = async (req, res) => {
  console.log('Register endpoint hit:', req.body);
  
  try {
    const { username, email, password } = req.body;

    // Валидация входных данных
    if (!username || !email || !password) {
      return res.status(400).json({ 
        error: 'Please provide all required fields' 
      });
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Please provide a valid email' 
      });
    }

    // Валидация пароля (минимум 6 символов)
    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long' 
      });
    }

    // Создаем пользователя
    const user = await User.create({ username, email, password });

    // Генерируем токен
    const token = generateToken(user.id);

    // Отправляем ответ
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
      constraint: error.constraint
    });
    
    // Обработка ошибок PostgreSQL
    if (error.code === '23505') { // Unique violation
      if (error.constraint === 'users_username_key') {
        return res.status(400).json({ 
          error: 'Username already exists' 
        });
      }
      if (error.constraint === 'users_email_key') {
        return res.status(400).json({ 
          error: 'Email already exists' 
        });
      }
    }
    
    // Обработка ошибки отсутствия таблицы
    if (error.code === '42P01') {
      return res.status(500).json({ 
        error: 'Database tables not found. Please run database setup.' 
      });
    }
    
    // Обработка ошибок уникальности (для совместимости)
    if (error.message.includes('already exists')) {
      return res.status(400).json({ 
        error: error.message 
      });
    }

    res.status(500).json({ 
      error: 'Error creating user',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Вход пользователя
// POST /api/auth/login
const login = async (req, res) => {
  console.log('Login attempt:', { email: req.body.email });
  
  try {
    const { email, password } = req.body;

    // Валидация
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Please provide email and password' 
      });
    }

    // Находим пользователя
    const user = await User.findByEmail(email);
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('Login failed: User not found for email:', email);
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    // Проверяем пароль
    const isPasswordValid = await User.comparePassword(password, user.password);
    console.log('Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('Login failed: Invalid password for user:', email);
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    // Генерируем токен
    const token = generateToken(user.id);

    // Отправляем ответ
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Error logging in' 
    });
  }
};

// Получить текущего пользователя
// GET /api/auth/me
const getMe = async (req, res) => {
  // req.user уже установлен в middleware protect
  res.json({
    success: true,
    user: req.user
  });
};

// Обновить профиль
// PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    
    if (!username && !email) {
      return res.status(400).json({ 
        error: 'Please provide data to update' 
      });
    }

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;

    const updatedUser = await User.update(req.user.id, updateData);

    res.json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.message.includes('already exists')) {
      return res.status(400).json({ 
        error: error.message 
      });
    }

    res.status(500).json({ 
      error: 'Error updating profile' 
    });
  }
};

// Изменить пароль
// PUT /api/auth/change-password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        error: 'Please provide current and new password' 
      });
    }

    // Получаем пользователя с паролем
    const userWithPassword = await User.findByEmail(req.user.email);

    // Проверяем текущий пароль
    const isPasswordValid = await User.comparePassword(
      currentPassword, 
      userWithPassword.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Current password is incorrect' 
      });
    }

    // Валидация нового пароля
    if (newPassword.length < 6) {
      return res.status(400).json({ 
        error: 'New password must be at least 6 characters long' 
      });
    }

    // Меняем пароль
    await User.changePassword(req.user.id, newPassword);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      error: 'Error changing password' 
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword
};