// src/App.js - Main application component with page transitions
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/layout/Header';
import PrivateRoute from './components/auth/PrivateRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';

// Page wrapper with transition animations
const PageTransition = ({ children }) => {
  const location = useLocation();
  
  return (
    <div 
      key={location.pathname} 
      className="page-enter"
      style={{ 
        position: 'relative',
        minHeight: '100vh'
      }}
    >
      {children}
    </div>
  );
};

function AppContent() {
  return (
    <div className="App bg-gradient-mesh" style={{ minHeight: '100vh' }}>
      <Header />
      <main className="min-vh-100">
        <Routes>
          <Route path="/" element={
            <PageTransition>
              <HomePage />
            </PageTransition>
          } />
          <Route path="/login" element={
            <PageTransition>
              <LoginPage />
            </PageTransition>
          } />
          <Route path="/register" element={
            <PageTransition>
              <RegisterPage />
            </PageTransition>
          } />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <PageTransition>
                <DashboardPage />
              </PageTransition>
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <PageTransition>
                <ProfilePage />
              </PageTransition>
            </PrivateRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;