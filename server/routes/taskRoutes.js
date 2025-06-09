// routes/taskRoutes.js - Роуты для работы с задачами
const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// Все роуты защищены - требуют аутентификации
router.use(protect);

// Специальные роуты (должны быть перед /:id)
router.get('/stats', getTaskStats);
router.get('/search', searchTasks);
router.get('/suggestions', getSuggestions);
router.get('/export/:format', exportTasks);
router.put('/bulk-update', bulkUpdateStatus);
router.post('/smart', createSmartTask);

// CRUD роуты
router.route('/')
  .get(getTasks)    // GET /api/tasks
  .post(createTask); // POST /api/tasks

router.route('/:id')
  .get(getTask)      // GET /api/tasks/:id
  .put(updateTask)   // PUT /api/tasks/:id
  .delete(deleteTask); // DELETE /api/tasks/:id

module.exports = router;