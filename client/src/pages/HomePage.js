// src/pages/HomePage.js - Домашняя страница
import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaTasks, FaUserPlus, FaSignInAlt, FaClock, FaChartBar } from 'react-icons/fa';

const HomePage = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Container className="py-5">
      <Row className="align-items-center min-vh-80">
        <Col lg={6} className="mb-5 mb-lg-0">
          <h1 className="display-4 fw-bold mb-4">
            Manage Your Tasks <br />
            <span className="text-primary">Efficiently</span>
          </h1>
          <p className="lead mb-4">
            Stay organized and boost your productivity with our intuitive task management system. 
            Create, track, and complete your tasks with ease.
          </p>
          
          {user ? (
            <Link to="/dashboard">
              <Button variant="primary" size="lg">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <div className="d-flex gap-3">
              <Link to="/register">
                <Button variant="primary" size="lg">
                  <FaUserPlus className="me-2" />
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline-primary" size="lg">
                  <FaSignInAlt className="me-2" />
                  Login
                </Button>
              </Link>
            </div>
          )}
        </Col>
        
        <Col lg={6}>
          <img
            src="https://via.placeholder.com/600x400/007bff/ffffff?text=Task+Manager"
            alt="Task Manager"
            className="img-fluid rounded shadow"
          />
        </Col>
      </Row>
      
      <Row className="mt-5 pt-5">
        <Col className="text-center mb-5">
          <h2 className="display-6 fw-bold">Key Features</h2>
          <p className="lead text-muted">Everything you need to stay productive</p>
        </Col>
      </Row>
      
      <Row className="g-4">
        <Col md={4}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="text-center p-4">
              <FaTasks className="text-primary mb-3" size={48} />
              <h4>Task Management</h4>
              <p className="text-muted">
                Create, update, and organize your tasks with custom priorities and statuses
              </p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="text-center p-4">
              <FaClock className="text-warning mb-3" size={48} />
              <h4>Status Tracking</h4>
              <p className="text-muted">
                Track your progress with pending, in-progress, and completed statuses
              </p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="text-center p-4">
              <FaChartBar className="text-success mb-3" size={48} />
              <h4>Statistics</h4>
              <p className="text-muted">
                Visualize your productivity with detailed statistics and insights
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;