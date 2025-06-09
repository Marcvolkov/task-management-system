// models/User.js - Модель для работы с пользователями
const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Создание нового пользователя
  static async create(userData) {
    const { username, email, password } = userData;
    
    // Хешируем пароль перед сохранением
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Store email in lowercase to avoid case sensitivity issues
    const query = `
      INSERT INTO users (username, email, password)
      VALUES ($1, LOWER($2), $3)
      RETURNING id, username, email, created_at
    `;
    
    try {
      const result = await pool.query(query, [username, email, hashedPassword]);
      return result.rows[0];
    } catch (error) {
      // Обработка ошибок уникальности
      if (error.code === '23505') {
        if (error.constraint === 'users_username_key') {
          throw new Error('Username already exists');
        }
        if (error.constraint === 'users_email_key') {
          throw new Error('Email already exists');
        }
      }
      throw error;
    }
  }

  // Поиск пользователя по email
  static async findByEmail(email) {
    // Make email comparison case-insensitive
    const query = 'SELECT * FROM users WHERE LOWER(email) = LOWER($1)';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  // Поиск пользователя по ID
  static async findById(id) {
    const query = 'SELECT id, username, email, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Проверка пароля
  static async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // Обновление данных пользователя
  static async update(id, userData) {
    const { username, email } = userData;
    
    // Динамически строим массив полей для обновления
    const fields = [];
    const values = [];
    let paramIndex = 1;
    
    if (username !== undefined) {
      fields.push(`username = $${paramIndex}`);
      values.push(username);
      paramIndex++;
    }
    
    if (email !== undefined) {
      fields.push(`email = LOWER($${paramIndex})`);
      values.push(email);
      paramIndex++;
    }
    
    // Если нет полей для обновления, возвращаем текущие данные
    if (fields.length === 0) {
      return this.findById(id);
    }
    
    // Добавляем updated_at
    fields.push('updated_at = CURRENT_TIMESTAMP');
    
    // Добавляем id в конце
    values.push(id);
    
    const query = `
      UPDATE users 
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, username, email, updated_at
    `;
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') {
        if (error.constraint === 'users_username_key') {
          throw new Error('Username already exists');
        }
        if (error.constraint === 'users_email_key') {
          throw new Error('Email already exists');
        }
      }
      throw error;
    }
  }

  // Изменение пароля
  static async changePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const query = `
      UPDATE users 
      SET password = $1
      WHERE id = $2
      RETURNING id, username, email
    `;
    
    const result = await pool.query(query, [hashedPassword, id]);
    return result.rows[0];
  }

  // Удаление пользователя
  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = User;