// src/components/tasks/TaskStats.js - Компонент статистики задач
import React, { useEffect } from 'react';
import { Card, Row, Col, ProgressBar } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaTasks, FaClock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { getStats } from '../../redux/slices/taskSlice';

const TaskStats = () => {
  const dispatch = useDispatch();
  const { stats } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(getStats());
  }, [dispatch]);

  if (!stats) {
    return null;
  }

  const total = parseInt(stats.total) || 0;
  const pending = parseInt(stats.pending) || 0;
  const inProgress = parseInt(stats.in_progress) || 0;
  const completed = parseInt(stats.completed) || 0;
  const highPriority = parseInt(stats.high_priority) || 0;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <h5 className="mb-4">Task Statistics</h5>
        
        <Row className="mb-4">
          <Col md={3} sm={6} className="mb-3">
            <div className="text-center">
              <FaTasks className="text-primary mb-2" size={24} />
              <h3 className="mb-0">{total}</h3>
              <small className="text-muted">Total Tasks</small>
            </div>
          </Col>
          
          <Col md={3} sm={6} className="mb-3">
            <div className="text-center">
              <FaClock className="text-warning mb-2" size={24} />
              <h3 className="mb-0">{pending}</h3>
              <small className="text-muted">Pending</small>
            </div>
          </Col>
          
          <Col md={3} sm={6} className="mb-3">
            <div className="text-center">
              <FaClock className="text-info mb-2" size={24} />
              <h3 className="mb-0">{inProgress}</h3>
              <small className="text-muted">In Progress</small>
            </div>
          </Col>
          
          <Col md={3} sm={6} className="mb-3">
            <div className="text-center">
              <FaCheckCircle className="text-success mb-2" size={24} />
              <h3 className="mb-0">{completed}</h3>
              <small className="text-muted">Completed</small>
            </div>
          </Col>
        </Row>
        
        <div className="mb-3">
          <div className="d-flex justify-content-between mb-1">
            <small>Completion Rate</small>
            <small>{completionRate}%</small>
          </div>
          <ProgressBar now={completionRate} variant="success" />
        </div>
        
        {highPriority > 0 && (
          <div className="alert alert-warning d-flex align-items-center mb-0">
            <FaExclamationTriangle className="me-2" />
            <small>You have {highPriority} high priority task{highPriority > 1 ? 's' : ''}</small>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default TaskStats;