// routes/initRoutes.js - Роут для инициализации базы данных
const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Секретный ключ для защиты роута
const INIT_SECRET = process.env.INIT_SECRET || 'your-secret-init-key';

router.post('/init-db/:secret', async (req, res) => {
  try {
    // Проверяем секретный ключ
    if (req.params.secret !== INIT_SECRET) {
      return res.status(403).json({ error: 'Invalid secret key' });
    }

    console.log('Starting database initialization...');

    // Создаем таблицы
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
        priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP
      )
    `);

    // Создаем индексы
    await pool.query('CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');

    res.json({ 
      success: true, 
      message: 'Database tables created successfully!' 
    });

  } catch (error) {
    console.error('Database initialization error:', error);
    res.status(500).json({ 
      error: 'Failed to initialize database', 
      details: error.message 
    });
  }
});

module.exports = router;