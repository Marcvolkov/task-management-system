// src/pages/DashboardPage.js - Страница панели управления
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import ProductivityInsights from '../components/dashboard/ProductivityInsights';
import TaskStats from '../components/tasks/TaskStats';
import TaskForm from '../components/tasks/TaskForm';
import TaskList from '../components/tasks/TaskList';

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1>Welcome back, {user?.username}!</h1>
          <p className="text-muted">Here's your task overview</p>
        </Col>
      </Row>
      
      {process.env.NODE_ENV === 'development' && <ProductivityInsights />}
      
      <Row>
        <Col lg={4} className="mb-4">
          <TaskStats />
          <TaskForm />
        </Col>
        
        <Col lg={8}>
          <h3 className="mb-3">Your Tasks</h3>
          <TaskList />
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardPage;