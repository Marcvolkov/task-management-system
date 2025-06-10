// src/components/tasks/TaskStats.js - Modern task statistics component
import React, { useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaTasks, FaClock, FaCheckCircle, FaExclamationTriangle, FaPlay } from 'react-icons/fa';
import { getStats, updateStatsFromTasks } from '../../redux/slices/taskSlice';

const TaskStats = () => {
  const dispatch = useDispatch();
  const { stats, tasks } = useSelector((state) => state.tasks);

  useEffect(() => {
    // Загружаем статистику с сервера только при первом рендере
    if (!stats) {
      dispatch(getStats());
    }
  }, [dispatch, stats]);

  // Обновляем статистику в реальном времени при изменении задач
  useEffect(() => {
    if (tasks && tasks.length >= 0) {
      dispatch(updateStatsFromTasks());
    }
  }, [tasks, dispatch]);

  if (!stats) {
    return null;
  }

  const total = parseInt(stats.total) || 0;
  const pending = parseInt(stats.pending) || 0;
  const inProgress = parseInt(stats.in_progress) || 0;
  const completed = parseInt(stats.completed) || 0;
  const highPriority = parseInt(stats.high_priority) || 0;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const StatCard = ({ icon, value, label, gradient, delay = 0 }) => (
    <Col md={6} lg={3} className="mb-4">
      <div 
        className="card-modern hover-lift h-100 p-3 text-center slide-up"
        style={{
          background: gradient,
          color: 'white',
          animationDelay: `${delay}s`
        }}
      >
        <div style={{
          background: 'rgba(255, 255, 255, 0.2)',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem'
        }}>
          {icon}
        </div>
        <h2 className="fw-bold mb-1" style={{ fontSize: '2rem' }}>{value}</h2>
        <p className="mb-0 opacity-75" style={{ fontSize: '0.9rem' }}>{label}</p>
      </div>
    </Col>
  );

  return (
    <>
      <div className="mb-4">
        <h5 className="fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>
          Task Statistics
        </h5>
        
        <Row className="g-3">
          <StatCard
            icon={<FaTasks size={24} />}
            value={total}
            label="Total Tasks"
            gradient="var(--primary-gradient)"
            delay={0}
          />
          
          <StatCard
            icon={<FaClock size={24} />}
            value={pending}
            label="Pending"
            gradient="var(--warning-gradient)"
            delay={0.1}
          />
          
          <StatCard
            icon={<FaPlay size={24} />}
            value={inProgress}
            label="In Progress"
            gradient="var(--accent-gradient)"
            delay={0.2}
          />
          
          <StatCard
            icon={<FaCheckCircle size={24} />}
            value={completed}
            label="Completed"
            gradient="var(--success-gradient)"
            delay={0.3}
          />
        </Row>
      </div>

      {/* Progress Card */}
      <div className="card-modern p-4 mb-4 fade-in">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>
            Overall Progress
          </h6>
          <span className="fw-bold" style={{ 
            color: completionRate >= 70 ? 'var(--success-color)' : 
                   completionRate >= 40 ? 'var(--warning-color)' : 'var(--error-color)',
            fontSize: '1.1rem'
          }}>
            {completionRate}%
          </span>
        </div>
        
        <div style={{
          background: 'var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          height: '12px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div
            style={{
              background: completionRate >= 70 ? 'var(--success-gradient)' : 
                         completionRate >= 40 ? 'var(--warning-gradient)' : 'var(--error-gradient)',
              height: '100%',
              width: `${completionRate}%`,
              borderRadius: 'var(--radius-lg)',
              transition: 'width 0.8s ease-out',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              animation: 'shimmer 2s infinite'
            }}></div>
          </div>
        </div>
        
        <div className="d-flex justify-content-between mt-2" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>

      {/* High Priority Alert */}
      {highPriority > 0 && (
        <div 
          className="card-modern p-3 mb-4 scale-in"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(238, 90, 36, 0.1))',
            border: '1px solid rgba(255, 107, 107, 0.3)'
          }}
        >
          <div className="d-flex align-items-center">
            <div style={{
              background: 'var(--error-gradient)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '0.75rem'
            }}>
              <FaExclamationTriangle size={16} color="white" />
            </div>
            <div>
              <p className="mb-0 fw-semibold" style={{ color: 'var(--error-color)' }}>
                High Priority Alert
              </p>
              <p className="mb-0" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {highPriority} task{highPriority > 1 ? 's' : ''} require{highPriority === 1 ? 's' : ''} immediate attention
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </>
  );
};

export default TaskStats;