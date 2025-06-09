// server.js - Главный файл сервера
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

// Загружаем переменные окружения из .env файла
dotenv.config();

// Validate critical environment variables
const validateEnvironment = () => {
  const required = ['JWT_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    console.error('💡 Copy .env.example to .env and configure the values');
    process.exit(1);
  }
  
  // Warn about weak JWT secret
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.includes('change_this')) {
    console.warn('⚠️  WARNING: JWT_SECRET appears to be a default value. Change it in production!');
  }
  
  // Warn about missing database configuration
  if (!process.env.DATABASE_URL && (!process.env.DB_USER || !process.env.DB_PASSWORD)) {
    console.warn('⚠️  WARNING: No database configuration found. Set DATABASE_URL or DB_USER/DB_PASSWORD');
  }
};

// Run validation
validateEnvironment();

// В начале файла после всех require
const setupDatabase = require('./setup-database');

// Создаем Express приложение
const app = express();

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // лимит запросов на IP
  message: {
    error: 'Too many requests',
    message: 'Rate limit exceeded. Try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
});

// CORS configuration for separate frontend deployment
const corsOptions = {
  origin: function (origin, callback) {
    // In development, allow all origins including localhost
    if (process.env.NODE_ENV === 'development') {
      callback(null, true);
      return;
    }
    
    // Production: allow specific origins including Render and Vercel
    const allowedOrigins = [
      'http://localhost:3000', // Local development
      'http://localhost:3001',
      process.env.FRONTEND_URL, // Main frontend URL (set in env)
      'https://task-management-frontend.onrender.com', // Render deployment
      /^https:\/\/task-management-.*\.vercel\.app$/, // Vercel preview deployments
      ...(process.env.ALLOWED_ORIGINS?.split(',') || [])
    ].filter(Boolean);
    
    // Allow requests with no origin (mobile apps, curl, Postman, etc.)
    if (!origin) {
      callback(null, true);
      return;
    }
    
    // Check string origins
    const stringOrigins = allowedOrigins.filter(o => typeof o === 'string');
    if (stringOrigins.includes(origin.trim())) {
      console.log(`✅ CORS allowed origin: ${origin}`);
      callback(null, true);
      return;
    }
    
    // Check regex origins (for Vercel deployments)
    const regexOrigins = allowedOrigins.filter(o => o instanceof RegExp);
    for (const regex of regexOrigins) {
      if (regex.test(origin)) {
        console.log(`✅ CORS allowed origin (regex): ${origin}`);
        callback(null, true);
        return;
      }
    }
    
    console.warn(`❌ CORS blocked request from origin: ${origin}`);
    console.warn(`🔍 Allowed origins: ${stringOrigins.join(', ')}, Vercel pattern: *.vercel.app`);
    callback(new Error(`Not allowed by CORS policy: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count']
};

// Middleware
app.use(cors(corsOptions)); // Разрешаем запросы с frontend

// Apply rate limiting to API routes
app.use('/api/', limiter);

// JSON parsing with error handling
app.use(express.json({
  limit: '10mb' // Limit request size
}));

app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Парсим URL-encoded данные

// Handle JSON parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'Invalid JSON',
      message: 'Request body contains invalid JSON syntax'
    });
  }
  next(err);
});

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const userAgent = req.get('User-Agent') || 'Unknown';
  
  console.log(`[${timestamp}] ${method} ${url} - ${req.ip} - ${userAgent}`);
  next();
});

// Импортируем роуты
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// API health check route
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Task Management API is running!',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      tasks: '/api/tasks',
      analytics: '/api/analytics'
    }
  });
});

// Root route - API info only (no React serving)
app.get('/', (req, res) => {
  res.json({ 
    message: 'Task Management API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    api: `${req.protocol}://${req.get('host')}/api`,
    endpoints: {
      auth: '/api/auth',
      tasks: '/api/tasks',
      analytics: '/api/analytics'
    },
    docs: 'See README.md for API documentation'
  });
});

// Подключаем роуты
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/analytics', analyticsRoutes);

// Catch-all handler for unknown routes - API only
app.use('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      error: 'API endpoint not found',
      path: req.originalUrl,
      method: req.method,
      availableEndpoints: ['/api/auth', '/api/tasks', '/api/analytics'],
      suggestion: 'Check the API documentation'
    });
  }
  
  // For non-API routes, return JSON response (no React serving)
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    message: 'This is a REST API server. Frontend is served separately.',
    api: '/api'
  });
});

// Обработка ошибок (должна быть последней)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// Определяем порт из переменных окружения или используем 5000
const PORT = process.env.PORT || 5000;

// Временный endpoint для создания БД (удалите после использования)
app.get('/api/init-db-now', async (req, res) => {
  try {
    await initializeDatabase();
    res.json({ 
      success: true, 
      message: 'Database initialization completed' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Автоматическая инициализация БД
async function initializeDatabase() {
  const { pool } = require('./config/database');
  
  try {
    console.log('🔍 Checking database tables...');
    
    // Проверяем существование таблицы users
    const checkTable = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    if (!checkTable.rows[0].exists) {
      console.log('📦 Creating database tables...');
      
      // Создаем таблицы
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

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

        CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
        CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
        CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      `);
      
      console.log('✅ Database tables created successfully!');
    } else {
      console.log('✅ Database tables already exist');
    }
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    // Не прерываем запуск сервера
  }
}

// Обновите функцию startServer
async function startServer() {
  try {
    // Инициализируем БД
    await initializeDatabase();
    
    // Запускаем сервер
    app.listen(PORT, () => {
      const env = process.env.NODE_ENV || 'development';
      console.log('\n🚀 Task Management Server Started!');
      console.log(`📍 Port: ${PORT}`);
      console.log(`🌍 Environment: ${env}`);
      console.log(`🔗 Server: http://localhost:${PORT}`);
      console.log('─'.repeat(50));
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Вместо прямого app.listen() в конце файла используем:
startServer();