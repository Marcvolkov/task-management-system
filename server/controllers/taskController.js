// controllers/taskController.js - Контроллер для работы с задачами
const Task = require('../models/Task');
const smartService = require('../services/smartService');

// Получить все задачи пользователя
// GET /api/tasks
const getTasks = async (req, res) => {
  try {
    // Извлекаем фильтры из query параметров
    const { status, priority } = req.query;
    const filters = {};
    
    if (status) filters.status = status;
    if (priority) filters.priority = priority;

    const tasks = await Task.findByUserId(req.user.id, filters);
    
    res.json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ 
      error: 'Error fetching tasks' 
    });
  }
};

// Получить одну задачу
// GET /api/tasks/:id
const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id, req.user.id);
    
    if (!task) {
      return res.status(404).json({ 
        error: 'Task not found' 
      });
    }

    res.json({
      success: true,
      task
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ 
      error: 'Error fetching task' 
    });
  }
};

// Создать новую задачу
// POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    // Валидация
    if (!title) {
      return res.status(400).json({ 
        error: 'Title is required' 
      });
    }

    // Валидация приоритета
    const validPriorities = ['low', 'medium', 'high'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({ 
        error: 'Priority must be low, medium, or high' 
      });
    }

    const task = await Task.create(
      { title, description, priority },
      req.user.id
    );

    res.status(201).json({
      success: true,
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ 
      error: 'Error creating task' 
    });
  }
};

// Создать умную задачу с AI-обогащением
// POST /api/tasks/smart
const createSmartTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Валидация
    if (!title) {
      return res.status(400).json({ 
        error: 'Title is required' 
      });
    }

    // Используем smartService для обогащения данных
    const estimatedMinutes = smartService.estimateTaskDuration(title, description || '');
    const priority = smartService.suggestPriority(title, description || '');
    const category = smartService.categorizeTask(title, description || '');

    // Создаем задачу с обогащенными данными
    const task = await Task.create(
      { 
        title, 
        description, 
        priority,
        estimated_minutes: estimatedMinutes,
        category 
      },
      req.user.id
    );

    res.status(201).json({
      success: true,
      task,
      smartEnhanced: true
    });
  } catch (error) {
    console.error('Create smart task error:', error);
    res.status(500).json({ 
      error: 'Error creating smart task' 
    });
  }
};

// Обновить задачу
// PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;

    // Валидация статуса
    const validStatuses = ['pending', 'in_progress', 'completed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Status must be pending, in_progress, or completed' 
      });
    }

    // Валидация приоритета
    const validPriorities = ['low', 'medium', 'high'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({ 
        error: 'Priority must be low, medium, or high' 
      });
    }

    const task = await Task.update(
      req.params.id,
      req.user.id,
      { title, description, status, priority }
    );

    if (!task) {
      return res.status(404).json({ 
        error: 'Task not found' 
      });
    }

    res.json({
      success: true,
      task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ 
      error: 'Error updating task' 
    });
  }
};

// Удалить задачу
// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const result = await Task.delete(req.params.id, req.user.id);
    
    if (!result) {
      return res.status(404).json({ 
        error: 'Task not found' 
      });
    }

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ 
      error: 'Error deleting task' 
    });
  }
};

// Получить статистику задач
// GET /api/tasks/stats
const getTaskStats = async (req, res) => {
  try {
    const stats = await Task.getStats(req.user.id);
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      error: 'Error fetching statistics' 
    });
  }
};

// Поиск задач с улучшенной релевантностью
// GET /api/tasks/search?q=search_term
const searchTasks = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ 
        error: 'Search query is required' 
      });
    }

    // Разбиваем поисковый запрос на слова
    const words = q.toLowerCase().trim().split(/\s+/).filter(word => word.length > 0);
    const originalTerm = q.toLowerCase().trim();
    
    // Строим SQL запрос с сортировкой по релевантности
    let whereConditions = [];
    let params = [req.user.id];
    let paramIndex = 2;
    
    // Добавляем условия поиска для каждого слова
    words.forEach(word => {
      whereConditions.push(`(LOWER(title) ILIKE $${paramIndex} OR LOWER(description) ILIKE $${paramIndex})`);
      params.push(`%${word}%`);
      paramIndex++;
    });
    
    const query = `
      SELECT *,
        CASE
          -- Точное совпадение в title: приоритет 1
          WHEN LOWER(title) = $${paramIndex} THEN 1
          -- Частичное совпадение в title: приоритет 2
          WHEN LOWER(title) ILIKE $${paramIndex + 1} THEN 2
          -- Совпадение в description: приоритет 3
          ELSE 3
        END as relevance_score
      FROM tasks 
      WHERE user_id = $1 
        AND (${whereConditions.join(' OR ')})
      ORDER BY relevance_score ASC, created_at DESC
    `;
    
    // Добавляем параметры для проверки релевантности
    params.push(originalTerm); // точное совпадение
    params.push(`%${originalTerm}%`); // частичное совпадение
    
    const db = require('../config/database');
    const result = await db.query(query, params);
    
    // Убираем relevance_score из результата
    const tasks = result.rows.map(({ relevance_score, ...task }) => task);
    
    res.json({
      success: true,
      count: tasks.length,
      tasks,
      searchQuery: q,
      searchWords: words
    });
  } catch (error) {
    console.error('Search tasks error:', error);
    res.status(500).json({ 
      error: 'Error searching tasks' 
    });
  }
};

// Массовое обновление статуса
// PUT /api/tasks/bulk-update
const bulkUpdateStatus = async (req, res) => {
  try {
    const { taskIds, status } = req.body;

    // Валидация
    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({ 
        error: 'Task IDs array is required' 
      });
    }

    const validStatuses = ['pending', 'in_progress', 'completed'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Valid status is required' 
      });
    }

    const updatedTasks = await Task.bulkUpdateStatus(
      req.user.id, 
      taskIds, 
      status
    );

    res.json({
      success: true,
      count: updatedTasks.length,
      tasks: updatedTasks
    });
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({ 
      error: 'Error updating tasks' 
    });
  }
};

// Получить автодополнения для поиска
// GET /api/tasks/suggestions?query=term
const getSuggestions = async (req, res) => {
  try {
    const { query } = req.query;
    
    // Если запрос слишком короткий, возвращаем пустой массив
    if (!query || query.length < 2) {
      return res.json({
        success: true,
        suggestions: []
      });
    }
    
    // Получаем все задачи пользователя
    const tasks = await Task.findByUserId(req.user.id);
    
    // Извлекаем уникальные слова из заголовков
    const words = new Set();
    const queryLower = query.toLowerCase();
    
    tasks.forEach(task => {
      if (task.title) {
        // Разбиваем заголовок на слова
        const titleWords = task.title
          .toLowerCase()
          .split(/\s+/)
          .filter(word => {
            // Фильтруем слова длиной > 3 символа, начинающиеся с query
            return word.length > 3 && 
                   word.startsWith(queryLower) &&
                   /^[a-zа-яё]+$/.test(word); // только буквы
          });
        
        titleWords.forEach(word => words.add(word));
      }
    });
    
    // Конвертируем в массив, сортируем и ограничиваем до 5 элементов
    const suggestions = Array.from(words)
      .sort()
      .slice(0, 5);
    
    res.json({
      success: true,
      suggestions,
      query
    });
  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({ 
      error: 'Error fetching suggestions' 
    });
  }
};

// Экспорт задач в разных форматах
// GET /api/tasks/export/:format
const exportTasks = async (req, res) => {
  try {
    const { format } = req.params;
    
    // Валидация формата
    const validFormats = ['json', 'csv'];
    if (!validFormats.includes(format.toLowerCase())) {
      return res.status(400).json({ 
        error: 'Invalid format. Supported formats: json, csv' 
      });
    }

    // Получаем все задачи пользователя
    const tasks = await Task.findByUserId(req.user.id);

    if (format.toLowerCase() === 'json') {
      // Для JSON просто возвращаем задачи
      return res.json({
        success: true,
        count: tasks.length,
        exportDate: new Date().toISOString(),
        tasks
      });
    }

    if (format.toLowerCase() === 'csv') {
      // Создаем CSV формат
      const csvHeaders = 'Title,Description,Status,Priority,Created At,Updated At\n';
      
      const csvData = tasks.map(task => {
        // Экранируем кавычки и переводы строк в данных
        const escapeCSV = (str) => {
          if (!str) return '';
          const escaped = str.toString().replace(/"/g, '""');
          return `"${escaped}"`;
        };

        const formatDate = (date) => {
          if (!date) return '';
          return new Date(date).toISOString().split('T')[0]; // YYYY-MM-DD
        };

        return [
          escapeCSV(task.title),
          escapeCSV(task.description || ''),
          escapeCSV(task.status),
          escapeCSV(task.priority),
          formatDate(task.created_at),
          formatDate(task.updated_at)
        ].join(',');
      }).join('\n');

      const csvContent = csvHeaders + csvData;

      // Устанавливаем заголовки для скачивания файла
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename=tasks.csv');
      
      // Добавляем BOM для корректного отображения в Excel
      const BOM = '\uFEFF';
      return res.send(BOM + csvContent);
    }
  } catch (error) {
    console.error('Export tasks error:', error);
    res.status(500).json({ 
      error: 'Error exporting tasks' 
    });
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  createSmartTask,
  updateTask,
  deleteTask,
  getTaskStats,
  searchTasks,
  getSuggestions,
  exportTasks,
  bulkUpdateStatus
};