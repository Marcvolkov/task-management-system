// src/components/auth/RegisterForm.js - Компонент формы регистрации
import React, { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { register, reset } from '../../redux/slices/authSlice';
import Alert from '../common/Alert';
import Loader from '../layout/Loader';

const RegisterForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [validationError, setValidationError] = useState('');

  const { username, email, password, confirmPassword } = formData;

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
    setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Валидация
    if (!username || !email || !password || !confirmPassword) {
      setValidationError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    dispatch(register({ username, email: email.toLowerCase(), password }));
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Card className="shadow fade-in">
      <Card.Body className="p-4">
        <h2 className="text-center mb-4">Register</h2>
        
        {(isError || validationError) && (
          <Alert
            variant="danger"
            message={validationError || message}
            onClose={() => {
              setValidationError('');
              dispatch(reset());
            }}
          />
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FaUser className="me-2" />
              Username
            </Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
            />
          </Form.Group>

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

          <Form.Group className="mb-3">
            <Form.Label>
              <FaLock className="me-2" />
              Password
            </Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Choose a password (min 6 characters)"
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>
              <FaLock className="me-2" />
              Confirm Password
            </Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100 mb-3"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Register'}
          </Button>
        </Form>

        <div className="text-center">
          <p className="mb-0">
            Already have an account?{' '}
            <Link to="/login">Login here</Link>
          </p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default RegisterForm;