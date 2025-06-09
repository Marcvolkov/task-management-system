// src/redux/services/taskService.js - Сервис для работы с задачами
import axios from '../../utils/axios';

const taskService = {
  // Получить все задачи
  getTasks: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    
    const response = await axios.get(`/tasks?${params.toString()}`);
    return response.data;
  },

  // Получить одну задачу
  getTask: async (id) => {
    const response = await axios.get(`/tasks/${id}`);
    return response.data;
  },

  // Создать задачу
  createTask: async (taskData) => {
    const response = await axios.post('/tasks', taskData);
    return response.data;
  },

  // Обновить задачу
  updateTask: async (id, taskData) => {
    const response = await axios.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Удалить задачу
  deleteTask: async (id) => {
    const response = await axios.delete(`/tasks/${id}`);
    return response.data;
  },

  // Получить статистику
  getStats: async () => {
    const response = await axios.get('/tasks/stats');
    return response.data;
  },

  // Поиск задач
  searchTasks: async (query) => {
    const response = await axios.get(`/tasks/search?q=${query}`);
    return response.data;
  },

  // Массовое обновление статуса
  bulkUpdateStatus: async (taskIds, status) => {
    const response = await axios.put('/tasks/bulk-update', { taskIds, status });
    return response.data;
  },
};

export default taskService;