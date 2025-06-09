// src/pages/LoginPage.js - Страница входа
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  return (
    <Container>
      <Row className="justify-content-center align-items-center min-vh-80">
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          <LoginForm />
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;