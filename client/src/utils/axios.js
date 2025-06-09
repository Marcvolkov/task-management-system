// src/utils/axios.js - Конфигурация Axios для API запросов
import axios from 'axios';

// Определяем базовый URL в зависимости от среды
const getBaseURL = () => {
  // Используем backend URL из переменной окружения
  return process.env.REACT_APP_API_URL || 'https://task-management-system-4q03.onrender.com/api';
};

// Создаем инстанс axios с базовой конфигурацией
const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  // Таймауты для лучшей надежности
  timeout: 10000, // 10 секунд
});

// ... остальной код остается тем же

// ... остальной код остается тем же

// Интерсептор для добавления токена к каждому запросу
axiosInstance.interceptors.request.use(
  (config) => {
    // Получаем токен из localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерсептор для обработки ошибок ответа
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Логируем ошибки только в development
    if (process.env.NODE_ENV === 'development') {
      console.warn('API Error:', error.response?.data || error.message);
    }
    
    // Если получили 401 (Unauthorized), перенаправляем на login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Избегаем перенаправления если уже на странице login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Обработка сетевых ошибок
    if (!error.response) {
      // Сетевая ошибка или сервер недоступен
      error.message = 'Network error. Please check your connection.';
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;