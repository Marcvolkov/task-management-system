// src/pages/RegisterPage.js - Страница регистрации
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => {
  return (
    <Container>
      <Row className="justify-content-center align-items-center min-vh-80">
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          <RegisterForm />
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;