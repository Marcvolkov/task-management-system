// src/components/dashboard/ProductivityInsights.js - Компонент аналитики продуктивности
import React, { useState, useEffect } from 'react';
import { Card, ProgressBar, Alert, Spinner, Row, Col, Badge } from 'react-bootstrap';
import { FaFire, FaTasks, FaClock, FaLightbulb } from 'react-icons/fa';
import api from '../../utils/axios';

const ProductivityInsights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return (
      <Card className="mb-4 shadow-sm">
        <Card.Body className="text-center py-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 mb-0">Loading productivity insights...</p>
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Alert variant="danger" className="mb-0">
            <FaLightbulb className="me-2" />
            {error}
          </Alert>
        </Card.Body>
      </Card>
    );
  }

  if (!insights) {
    return null;
  }

  const getCompletionVariant = (rate) => {
    if (rate >= 70) return 'success';
    if (rate >= 40) return 'warning';
    return 'danger';
  };

  const getStreakColor = (streak) => {
    if (streak >= 7) return 'success';
    if (streak >= 3) return 'warning';
    return 'secondary';
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">
          <FaLightbulb className="me-2" />
          Productivity Insights
        </h5>
      </Card.Header>
      <Card.Body>
        <Row>
          {/* Completion Rate */}
          <Col md={6} className="mb-3">
            <div className="d-flex align-items-center mb-2">
              <FaTasks className="text-primary me-2" />
              <strong>Completion Rate</strong>
            </div>
            <ProgressBar 
              now={insights.completionRate} 
              variant={getCompletionVariant(insights.completionRate)}
              label={`${insights.completionRate}%`}
              style={{ height: '25px' }}
            />
            <small className="text-muted">
              {insights.stats?.completed || 0} of {insights.stats?.total || 0} tasks completed
            </small>
          </Col>

          {/* Current Streak */}
          <Col md={3} className="mb-3">
            <div className="d-flex align-items-center mb-2">
              <FaFire className="text-danger me-2" />
              <strong>Current Streak</strong>
            </div>
            <div className="d-flex align-items-center">
              <Badge 
                bg={getStreakColor(insights.currentStreak)} 
                className="fs-6 p-2"
              >
                <FaFire className="me-1" />
                {insights.currentStreak} days
              </Badge>
            </div>
            <small className="text-muted">
              Days with completed tasks
            </small>
          </Col>

          {/* Tasks Per Day */}
          <Col md={3} className="mb-3">
            <div className="d-flex align-items-center mb-2">
              <FaClock className="text-info me-2" />
              <strong>Daily Average</strong>
            </div>
            <div className="d-flex align-items-center">
              <Badge bg="info" className="fs-6 p-2">
                {insights.tasksPerDay} tasks/day
              </Badge>
            </div>
            <small className="text-muted">
              Last 7 days
            </small>
          </Col>
        </Row>

        {/* Most Productive Hour */}
        {insights.mostProductiveHour && (
          <Row className="mb-3">
            <Col>
              <div className="d-flex align-items-center mb-2">
                <FaClock className="text-warning me-2" />
                <strong>Most Productive Hour</strong>
              </div>
              <Badge bg="warning" text="dark" className="fs-6 p-2">
                {insights.mostProductiveHour}:00 - {insights.mostProductiveHour + 1}:00
              </Badge>
              <small className="text-muted d-block">
                Based on task completion times
              </small>
            </Col>
          </Row>
        )}

        {/* Recommendations */}
        {insights.recommendations && insights.recommendations.length > 0 && (
          <div>
            <h6 className="mb-3">
              <FaLightbulb className="text-warning me-2" />
              Recommendations
            </h6>
            {insights.recommendations.map((recommendation, index) => (
              <Alert 
                key={index} 
                variant="info" 
                className="mb-2 py-2"
              >
                <small className="mb-0">
                  <FaLightbulb className="me-2" />
                  {recommendation}
                </small>
              </Alert>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        <Row className="mt-3 pt-3 border-top">
          <Col xs={3} className="text-center">
            <div className="text-primary fs-4 fw-bold">{insights.stats?.pending || 0}</div>
            <small className="text-muted">Pending</small>
          </Col>
          <Col xs={3} className="text-center">
            <div className="text-warning fs-4 fw-bold">{insights.stats?.in_progress || 0}</div>
            <small className="text-muted">In Progress</small>
          </Col>
          <Col xs={3} className="text-center">
            <div className="text-success fs-4 fw-bold">{insights.stats?.completed || 0}</div>
            <small className="text-muted">Completed</small>
          </Col>
          <Col xs={3} className="text-center">
            <div className="text-danger fs-4 fw-bold">{insights.stats?.high_priority || 0}</div>
            <small className="text-muted">High Priority</small>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ProductivityInsights; 