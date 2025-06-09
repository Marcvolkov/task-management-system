// src/redux/services/authService.js - Сервис для работы с аутентификацией
import axios from '../../utils/axios';

const authService = {
  // Регистрация
  register: async (userData) => {
    const response = await axios.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Вход
  login: async (credentials) => {
    const response = await axios.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Выход
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Получить текущего пользователя
  getCurrentUser: async () => {
    const response = await axios.get('/auth/me');
    return response.data;
  },

  // Обновить профиль
  updateProfile: async (userData) => {
    const response = await axios.put('/auth/profile', userData);
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Изменить пароль
  changePassword: async (passwordData) => {
    const response = await axios.put('/auth/change-password', passwordData);
    return response.data;
  },
};

export default authService;