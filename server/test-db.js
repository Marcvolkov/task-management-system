// test-db.js - Тест подключения к базе данных
const { pool } = require('./config/database');

async function testConnection() {
  try {
    console.log('🔌 Testing database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    
    // Простой запрос для проверки подключения
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully!');
    console.log('⏰ Current time from DB:', result.rows[0].now);
    
    // Проверяем существование таблиц
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `);
    
    console.log('\n📋 Existing tables:');
    tables.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    // Проверяем структуру таблицы users если она существует
    const hasUsersTable = tables.rows.some(row => row.table_name === 'users');
    if (hasUsersTable) {
      const columns = await pool.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'users'
      `);
      
      console.log('\n👥 Users table structure:');
      columns.rows.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'NO' ? 'NOT NULL' : ''}`);
      });
    } else {
      console.log('\n⚠️  Users table does not exist! Run setup-db script.');
    }
    
  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error('Error:', error.message);
    console.error('Error code:', error.code);
  } finally {
    await pool.end();
  }
}

testConnection();