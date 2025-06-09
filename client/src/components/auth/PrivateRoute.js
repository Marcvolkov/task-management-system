// src/components/auth/PrivateRoute.js - Компонент для защищенных маршрутов
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  
  // Если нет пользователя, перенаправляем на страницу входа
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;