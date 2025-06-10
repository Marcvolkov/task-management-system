// src/pages/DashboardPage.js - Modern dashboard page
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTheme } from '../contexts/ThemeContext';
import ProductivityInsights from '../components/dashboard/ProductivityInsights';
import TaskStats from '../components/tasks/TaskStats';
import TaskForm from '../components/tasks/TaskForm';
import TaskList from '../components/tasks/TaskList';

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const { isDark } = useTheme();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div style={{ 
      background: isDark 
        ? 'linear-gradient(135deg, var(--background-color) 0%, rgba(30, 41, 59, 0.8) 100%)'
        : 'linear-gradient(135deg, var(--background-color) 0%, rgba(248, 250, 252, 0.8) 100%)',
      minHeight: '100vh',
      paddingTop: '2rem'
    }}>
      <Container className="py-4">
        {/* Welcome Header */}
        <div className="mb-5">
          <Row className="align-items-center">
            <Col>
              <div className="fade-in">
                <h1 className="display-6 fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {getGreeting()}, {user?.username}! 👋
                </h1>
                <p className="lead mb-0" style={{ color: 'var(--text-secondary)' }}>
                  Ready to tackle your tasks and boost productivity?
                </p>
              </div>
            </Col>
          </Row>
        </div>
        
        {/* Development Analytics */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-5">
            <ProductivityInsights />
          </div>
        )}
        
        {/* Main Dashboard Content */}
        <Row className="g-4">
          {/* Left Sidebar - Stats and Form */}
          <Col xl={4} lg={5} className="mb-4">
            <div className="slide-up">
              <TaskStats />
              <div className="mt-4">
                <TaskForm />
              </div>
            </div>
          </Col>
          
          {/* Main Content - Task List */}
          <Col xl={8} lg={7}>
            <div className="scale-in">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h3 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>
                  Your Tasks
                </h3>
                <div className="d-flex align-items-center gap-2">
                  <div style={{
                    background: 'var(--primary-gradient)',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    animation: 'pulse 2s infinite'
                  }}></div>
                  <span style={{ 
                    fontSize: '0.9rem', 
                    color: 'var(--text-muted)',
                    fontWeight: '500'
                  }}>
                    Live Updates
                  </span>
                </div>
              </div>
              
              <div className="card-modern p-0" style={{ 
                background: 'var(--surface-color)',
                border: `1px solid var(--border-color)`,
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden'
              }}>
                <TaskList />
              </div>
            </div>
          </Col>
        </Row>
        
        {/* CSS for animations */}
        <style jsx>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.2); }
          }
        `}</style>
      </Container>
    </div>
  );
};

export default DashboardPage;