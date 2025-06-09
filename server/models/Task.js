// models/Task.js - Модель для работы с задачами
const db = require('../config/database');

class Task {
  // Создание новой задачи
  static async create(taskData, userId) {
    const { title, description, priority = 'medium' } = taskData;
    
    const query = `
      INSERT INTO tasks (title, description, priority, user_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const result = await db.query(query, [title, description, priority, userId]);
    return result.rows[0];
  }

  // Получить все задачи пользователя
  static async findByUserId(userId, filters = {}) {
    let query = 'SELECT * FROM tasks WHERE user_id = $1';
    const params = [userId];
    let paramIndex = 2;

    // Добавляем фильтры если они есть
    if (filters.status) {
      query += ` AND status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    if (filters.priority) {
      query += ` AND priority = $${paramIndex}`;
      params.push(filters.priority);
      paramIndex++;
    }

    // Добавляем сортировку
    query += ' ORDER BY created_at DESC';

    const result = await db.query(query, params);
    return result.rows;
  }

  // Получить задачу по ID
  static async findById(id, userId) {
    const query = 'SELECT * FROM tasks WHERE id = $1 AND user_id = $2';
    const result = await db.query(query, [id, userId]);
    return result.rows[0];
  }

  // Обновить задачу
  static async update(id, userId, taskData) {
    const { title, description, status, priority } = taskData;
    
    // Если статус меняется на completed, устанавливаем completed_at
    const completedAt = status === 'completed' ? 'CURRENT_TIMESTAMP' : 'NULL';
    
    const query = `
      UPDATE tasks 
      SET 
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        status = COALESCE($3, status),
        priority = COALESCE($4, priority),
        completed_at = CASE 
          WHEN $3 = 'completed' THEN CURRENT_TIMESTAMP 
          WHEN $3 != 'completed' THEN NULL
          ELSE completed_at
        END
      WHERE id = $5 AND user_id = $6
      RETURNING *
    `;
    
    const result = await db.query(query, [
      title, 
      description, 
      status, 
      priority, 
      id, 
      userId
    ]);
    
    return result.rows[0];
  }

  // Удалить задачу
  static async delete(id, userId) {
    const query = 'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id';
    const result = await db.query(query, [id, userId]);
    return result.rows[0];
  }

  // Получить статистику задач пользователя
  static async getStats(userId) {
    const query = `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
        COUNT(CASE WHEN priority = 'high' THEN 1 END) as high_priority,
        COUNT(CASE WHEN priority = 'medium' THEN 1 END) as medium_priority,
        COUNT(CASE WHEN priority = 'low' THEN 1 END) as low_priority
      FROM tasks
      WHERE user_id = $1
    `;
    
    const result = await db.query(query, [userId]);
    return result.rows[0];
  }

  // Поиск задач по названию или описанию
  static async search(userId, searchTerm) {
    const query = `
      SELECT * FROM tasks 
      WHERE user_id = $1 
        AND (title ILIKE $2 OR description ILIKE $2)
      ORDER BY created_at DESC
    `;
    
    const searchPattern = `%${searchTerm}%`;
    const result = await db.query(query, [userId, searchPattern]);
    return result.rows;
  }

  // Массовое обновление статуса
  static async bulkUpdateStatus(userId, taskIds, newStatus) {
    const query = `
      UPDATE tasks 
      SET status = $1,
          completed_at = CASE 
            WHEN $1 = 'completed' THEN CURRENT_TIMESTAMP 
            ELSE NULL
          END
      WHERE user_id = $2 AND id = ANY($3::int[])
      RETURNING *
    `;
    
    const result = await db.query(query, [newStatus, userId, taskIds]);
    return result.rows;
  }
}

module.exports = Task;