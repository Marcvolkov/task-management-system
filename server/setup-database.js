// setup-database.js - Скрипт для создания таблиц в базе данных
const { pool } = require('./config/database');

async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...');
    
    // SQL для создания таблиц
    const createTablesSQL = `
      -- Создаем таблицу пользователей
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Создаем таблицу задач
      CREATE TABLE IF NOT EXISTS tasks (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
          priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          completed_at TIMESTAMP
      );

      -- Создаем индексы для оптимизации
      CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
      CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
      CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `;
    
    // Выполняем SQL
    await pool.query(createTablesSQL);
    
    console.log('✅ Database tables created successfully!');
    
    // Проверяем таблицы
    const checkTables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'tasks')
    `);
    
    console.log('📋 Created tables:', checkTables.rows.map(r => r.table_name));
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.error('Details:', error);
    throw error; // Пробрасываем ошибку дальше
  }
}

// Экспортируем функцию
module.exports = setupDatabase;

// Если файл запущен напрямую (не через require)
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('✅ Setup completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    });
}