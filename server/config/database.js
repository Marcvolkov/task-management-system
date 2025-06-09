// config/database.js - Конфигурация базы данных
const { Pool } = require('pg');

// Строка подключения к базе данных
const getConnectionConfig = () => {
  // Приоритет: DATABASE_URL > отдельные параметры
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
      } : false,
    };
  }
  
  // Использование отдельных параметров для локальной разработки
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'task_management',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  };
  
  // Проверяем наличие обязательных параметров
  if (!config.user || !config.password) {
    throw new Error('Database credentials missing. Set DATABASE_URL or DB_USER/DB_PASSWORD');
  }
  
  return config;
};

const poolConfig = {
  ...getConnectionConfig(),
  // Настройки пула соединений
  max: parseInt(process.env.DB_POOL_MAX) || 20,
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT) || 30000,
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 2000,
  statement_timeout: parseInt(process.env.DB_STATEMENT_TIMEOUT) || 30000,
  query_timeout: parseInt(process.env.DB_QUERY_TIMEOUT) || 30000,
};

const pool = new Pool(poolConfig);

// Проверяем подключение при запуске
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Функция для выполнения запросов
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Query error', error);
    throw error;
  }
};

// Функция для получения клиента из пула (для транзакций)
const getClient = () => {
  return pool.connect();
};

module.exports = {
  query,
  getClient,
  pool
};