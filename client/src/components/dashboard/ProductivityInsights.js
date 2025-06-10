// src/components/dashboard/ProductivityInsights.js - Modern analytics component with visual charts
import React, { useState, useEffect } from 'react';
import { Alert, Row, Col } from 'react-bootstrap';
import { FaFire, FaClock, FaLightbulb, FaChartLine, FaArrowUp, FaCalendarAlt, FaBullseye } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import api from '../../utils/axios';

const ProductivityInsights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useTheme();

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/analytics/insights');
      setInsights(response.data.insights);
    } catch (err) {
      console.error('Error loading insights:', err);
      setError(err.response?.data?.error || 'Failed to load insights');
    } finally {
      setLoading(false);
    }
  };

  // Simple chart component for progress visualization
  const ProgressChart = ({ value, max, label, gradient, icon }) => (
    <div className="card-modern p-3 h-100 text-center">
      <div style={{
        background: gradient,
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        {icon}
      </div>
      <h3 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>{value}</h3>
      <p className="mb-2" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{label}</p>
      <div style={{
        background: 'var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        height: '8px',
        overflow: 'hidden'
      }}>
        <div style={{
          background: gradient,
          height: '100%',
          width: `${Math.min((value / max) * 100, 100)}%`,
          borderRadius: 'var(--radius-lg)',
          transition: 'width 1s ease-out'
        }}></div>
      </div>
      <small style={{ color: 'var(--text-muted)' }}>
        {value} / {max}
      </small>
    </div>
  );


  if (loading) {
    return (
      <div className="card-modern p-4 mb-4 text-center">
        <div style={{
          background: 'var(--primary-gradient)',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          animation: 'pulse 2s infinite'
        }}>
          <FaChartLine size={20} color="white" />
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>Loading productivity insights...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-modern p-4 mb-4">
        <Alert variant="danger" className="mb-0">
          <FaLightbulb className="me-2" />
          {error}
        </Alert>
      </div>
    );
  }

  if (!insights) {
    return null;
  }

  const getCompletionGradient = (rate) => {
    if (rate >= 70) return 'var(--success-gradient)';
    if (rate >= 40) return 'var(--warning-gradient)';
    return 'var(--error-gradient)';
  };

  // Generate sample time-based data for demonstration
  const generateTimeData = () => {
    const hours = [];
    for (let i = 8; i <= 20; i++) {
      hours.push({
        hour: i,
        tasks: Math.floor(Math.random() * 8) + 1
      });
    }
    return hours;
  };

  const timeData = generateTimeData();

  return (
    <div className="mb-4">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center">
          <div style={{
            background: 'var(--accent-gradient)',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '0.75rem'
          }}>
            <FaChartLine size={16} color="white" />
          </div>
          <div>
            <h5 className="mb-0 fw-bold" style={{ color: 'var(--text-primary)' }}>
              Productivity Analytics
            </h5>
            <p className="mb-0" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Track your progress and performance insights
            </p>
          </div>
        </div>
        <div style={{
          background: insights.completionRate >= 70 ? 'var(--success-gradient)' : 
                     insights.completionRate >= 40 ? 'var(--warning-gradient)' : 'var(--error-gradient)',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: 'var(--radius-lg)',
          fontSize: '0.9rem',
          fontWeight: '600'
        }}>
          {insights.completionRate}% Complete
        </div>
      </div>

      {/* Main Analytics Cards */}
      <Row className="g-4 mb-4">
        <Col lg={3} md={6}>
          <ProgressChart
            value={insights.stats?.completed || 0}
            max={insights.stats?.total || 1}
            label="Tasks Completed"
            gradient="var(--success-gradient)"
            icon={<FaBullseye size={20} color="white" />}
          />
        </Col>
        
        <Col lg={3} md={6}>
          <ProgressChart
            value={insights.currentStreak}
            max={30}
            label="Day Streak"
            gradient="var(--error-gradient)"
            icon={<FaFire size={20} color="white" />}
          />
        </Col>
        
        <Col lg={3} md={6}>
          <ProgressChart
            value={insights.tasksPerDay}
            max={20}
            label="Daily Average"
            gradient="var(--primary-gradient)"
            icon={<FaCalendarAlt size={20} color="white" />}
          />
        </Col>
        
        <Col lg={3} md={6}>
          <ProgressChart
            value={insights.stats?.high_priority || 0}
            max={10}
            label="High Priority"
            gradient="var(--warning-gradient)"
            icon={<FaArrowUp size={20} color="white" />}
          />
        </Col>
      </Row>

      {/* Completion Rate Visualization */}
      <div className="card-modern p-4 mb-4">
        <div className="d-flex align-items-center mb-3">
          <FaChartLine style={{ color: 'var(--primary-color)', marginRight: '0.5rem' }} />
          <h6 className="mb-0 fw-bold" style={{ color: 'var(--text-primary)' }}>
            Overall Completion Rate
          </h6>
        </div>
        
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <div style={{
            background: 'var(--border-light)',
            borderRadius: 'var(--radius-xl)',
            height: '20px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{
              background: getCompletionGradient(insights.completionRate),
              height: '100%',
              width: `${insights.completionRate}%`,
              borderRadius: 'var(--radius-xl)',
              transition: 'width 1.5s ease-out',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                animation: 'shimmer 2s infinite'
              }}></div>
            </div>
            <div style={{
              position: 'absolute',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: insights.completionRate > 50 ? 'white' : 'var(--text-primary)',
              fontSize: '0.8rem',
              fontWeight: '600'
            }}>
              {insights.completionRate}%
            </div>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-4 text-center">
            <div style={{ 
              color: 'var(--success-color)', 
              fontSize: '1.25rem', 
              fontWeight: 'bold' 
            }}>
              {insights.stats?.completed || 0}
            </div>
            <small style={{ color: 'var(--text-muted)' }}>Completed</small>
          </div>
          <div className="col-4 text-center">
            <div style={{ 
              color: 'var(--primary-color)', 
              fontSize: '1.25rem', 
              fontWeight: 'bold' 
            }}>
              {insights.stats?.in_progress || 0}
            </div>
            <small style={{ color: 'var(--text-muted)' }}>In Progress</small>
          </div>
          <div className="col-4 text-center">
            <div style={{ 
              color: 'var(--text-muted)', 
              fontSize: '1.25rem', 
              fontWeight: 'bold' 
            }}>
              {insights.stats?.pending || 0}
            </div>
            <small style={{ color: 'var(--text-muted)' }}>Pending</small>
          </div>
        </div>
      </div>

      {/* Time-based Analytics */}
      <div className="card-modern p-4 mb-4">
        <div className="d-flex align-items-center mb-3">
          <FaClock style={{ color: 'var(--warning-color)', marginRight: '0.5rem' }} />
          <h6 className="mb-0 fw-bold" style={{ color: 'var(--text-primary)' }}>
            Productivity by Hour
          </h6>
        </div>
        
        <div className="d-flex align-items-end justify-content-between" style={{ height: '120px' }}>
          {timeData.map((item, index) => (
            <div key={index} className="d-flex flex-column align-items-center">
              <div style={{
                background: 'var(--primary-gradient)',
                width: '12px',
                height: `${Math.max((item.tasks / 8) * 80, 8)}px`,
                borderRadius: 'var(--radius-sm)',
                margin: '0 1px',
                transition: `height 0.5s ease-out ${index * 0.1}s`
              }}></div>
              <small style={{ 
                color: 'var(--text-muted)', 
                fontSize: '0.7rem', 
                marginTop: '0.25rem',
                writing: 'vertical-rl',
                textOrientation: 'mixed'
              }}>
                {item.hour}h
              </small>
            </div>
          ))}
        </div>

        {insights.mostProductiveHour && (
          <div className="mt-3 p-2 rounded" style={{ 
            background: 'var(--warning-gradient)', 
            color: 'white' 
          }}>
            <small>
              <FaFire className="me-2" />
              Peak productivity: {insights.mostProductiveHour}:00 - {insights.mostProductiveHour + 1}:00
            </small>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {insights.recommendations && insights.recommendations.length > 0 && (
        <div className="card-modern p-4">
          <div className="d-flex align-items-center mb-3">
            <FaLightbulb style={{ color: 'var(--accent-color)', marginRight: '0.5rem' }} />
            <h6 className="mb-0 fw-bold" style={{ color: 'var(--text-primary)' }}>
              Smart Recommendations
            </h6>
          </div>
          
          <div className="d-flex flex-column gap-2">
            {insights.recommendations.map((recommendation, index) => (
              <div 
                key={index} 
                className="d-flex align-items-start p-3 rounded"
                style={{
                  background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.1), rgba(0, 242, 254, 0.1))',
                  border: '1px solid rgba(79, 172, 254, 0.2)'
                }}
              >
                <div style={{
                  background: 'var(--accent-gradient)',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '0.75rem',
                  flexShrink: 0
                }}>
                  <FaLightbulb size={10} color="white" />
                </div>
                <p className="mb-0" style={{ 
                  color: 'var(--text-primary)', 
                  fontSize: '0.9rem' 
                }}>
                  {recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default ProductivityInsights; 