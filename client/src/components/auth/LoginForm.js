// src/components/auth/LoginForm.js - Modern login form component
import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaEnvelope, FaLock, FaGithub, FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { login, reset } from '../../redux/slices/authSlice';
import { useTheme } from '../../contexts/ThemeContext';
import Alert from '../common/Alert';
import Loader from '../layout/Loader';

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

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

  const handleSocialLogin = (provider) => {
    // Placeholder for social login implementation
    console.log(`Login with ${provider} - Feature coming soon!`);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="scale-in">
      <div 
        className="glass-effect"
        style={{
          background: isDark 
            ? 'rgba(30, 41, 59, 0.8)' 
            : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: 'var(--radius-xl)',
          border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(226, 232, 240, 0.8)'}`,
          boxShadow: 'var(--shadow-xl)',
          padding: '3rem',
          maxWidth: '400px',
          width: '100%'
        }}
      >
        {/* Header */}
        <div className="text-center mb-4">
          <div style={{
            background: 'var(--primary-gradient)',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <FaLock size={24} color="white" />
          </div>
          <h2 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Welcome Back
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Sign in to your account to continue
          </p>
        </div>
        
        {isError && (
          <div className="mb-4">
            <Alert
              variant="danger"
              message={message}
              onClose={() => dispatch(reset())}
            />
          </div>
        )}

        <Form onSubmit={handleSubmit}>
          {/* Email Field */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
              Email Address
            </Form.Label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: focusedField === 'email' ? 'var(--primary-color)' : 'var(--text-muted)',
                transition: 'color var(--transition-base)',
                zIndex: 2
              }}>
                <FaEnvelope size={16} />
              </div>
              <Form.Control
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter your email address"
                required
                style={{
                  background: 'var(--border-light)',
                  border: `2px solid ${focusedField === 'email' ? 'var(--primary-color)' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '0.75rem 1rem 0.75rem 3rem',
                  fontSize: '1rem',
                  color: 'var(--text-primary)',
                  transition: 'all var(--transition-base)',
                  boxShadow: focusedField === 'email' ? '0 0 0 3px rgba(102, 126, 234, 0.1)' : 'none'
                }}
              />
            </div>
          </Form.Group>

          {/* Password Field */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
              Password
            </Form.Label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: focusedField === 'password' ? 'var(--primary-color)' : 'var(--text-muted)',
                transition: 'color var(--transition-base)',
                zIndex: 2
              }}>
                <FaLock size={16} />
              </div>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter your password"
                required
                style={{
                  background: 'var(--border-light)',
                  border: `2px solid ${focusedField === 'password' ? 'var(--primary-color)' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '0.75rem 3rem 0.75rem 3rem',
                  fontSize: '1rem',
                  color: 'var(--text-primary)',
                  transition: 'all var(--transition-base)',
                  boxShadow: focusedField === 'password' ? '0 0 0 3px rgba(102, 126, 234, 0.1)' : 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  transition: 'color var(--transition-base)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'var(--primary-color)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'var(--text-muted)';
                }}
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
          </Form.Group>

          {/* Login Button */}
          <button
            type="submit"
            className="btn-gradient w-100 mb-4"
            disabled={isLoading}
            style={{
              padding: '0.875rem',
              fontSize: '1rem',
              fontWeight: '600',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            {isLoading ? (
              <div className="d-flex align-items-center justify-content-center">
                <div 
                  style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginRight: '0.5rem'
                  }}
                ></div>
                Signing In...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </Form>

        {/* Divider */}
        <div className="d-flex align-items-center my-4">
          <div style={{ 
            flex: 1, 
            height: '1px', 
            background: 'var(--border-color)' 
          }}></div>
          <span style={{ 
            padding: '0 1rem', 
            color: 'var(--text-muted)', 
            fontSize: '0.9rem' 
          }}>
            or continue with
          </span>
          <div style={{ 
            flex: 1, 
            height: '1px', 
            background: 'var(--border-color)' 
          }}></div>
        </div>

        {/* Social Login Buttons */}
        <div className="d-flex gap-3 mb-4">
          <button
            type="button"
            onClick={() => handleSocialLogin('google')}
            className="hover-lift"
            style={{
              flex: 1,
              background: 'var(--border-light)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '0.75rem',
              cursor: 'pointer',
              transition: 'all var(--transition-base)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              color: 'var(--text-primary)',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#ea4335';
              e.target.style.color = 'white';
              e.target.style.borderColor = '#ea4335';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'var(--border-light)';
              e.target.style.color = 'var(--text-primary)';
              e.target.style.borderColor = 'var(--border-color)';
            }}
          >
            <FaGoogle size={16} />
            Google
          </button>
          
          <button
            type="button"
            onClick={() => handleSocialLogin('github')}
            className="hover-lift"
            style={{
              flex: 1,
              background: 'var(--border-light)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '0.75rem',
              cursor: 'pointer',
              transition: 'all var(--transition-base)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              color: 'var(--text-primary)',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#333';
              e.target.style.color = 'white';
              e.target.style.borderColor = '#333';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'var(--border-light)';
              e.target.style.color = 'var(--text-primary)';
              e.target.style.borderColor = 'var(--border-color)';
            }}
          >
            <FaGithub size={16} />
            GitHub
          </button>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="mb-0" style={{ color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link 
              to="/register"
              style={{
                color: 'var(--primary-color)',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'color var(--transition-base)'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = 'var(--primary-dark)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = 'var(--primary-color)';
              }}
            >
              Create Account
            </Link>
          </p>
        </div>

        {/* CSS for spinner animation */}
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default LoginForm;