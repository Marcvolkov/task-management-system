// src/components/auth/LoginForm.js - Компонент формы входа
import React, { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { login, reset } from '../../redux/slices/authSlice';
import Alert from '../common/Alert';
import Loader from '../layout/Loader';

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  useEffect(() => {
    if (isSuccess || user) {
      navigate('/dashboard');
    }

    dispatch(reset());
  }, [user, isSuccess, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }

    dispatch(login({ email: email.toLowerCase(), password }));
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Card className="shadow fade-in">
      <Card.Body className="p-4">
        <h2 className="text-center mb-4">Login</h2>
        
        {isError && (
          <Alert
            variant="danger"
            message={message}
            onClose={() => dispatch(reset())}
          />
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaEnvelope className="me-2" />
              Email
            </Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>
              <FaLock className="me-2" />
              Password
            </Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100 mb-3"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </Form>

        <div className="text-center">
          <p className="mb-0">
            Don't have an account?{' '}
            <Link to="/register">Register here</Link>
          </p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default LoginForm;