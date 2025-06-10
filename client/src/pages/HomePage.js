// src/pages/HomePage.js - Home page with modern landing design
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaTasks, FaUserPlus, FaSignInAlt, FaClock, FaChartBar, FaArrowRight, FaPlay } from 'react-icons/fa';

const HomePage = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      {/* Hero Section with Gradient Background */}
      <section style={{
        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background Elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: '200px',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '5%',
          width: '150px',
          height: '150px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse'
        }}></div>
        
        <Container className="py-5">
          <Row className="align-items-center min-vh-80">
            <Col lg={6} className="mb-5 mb-lg-0">
              <div className="fade-in">
                <h1 className="display-3 fw-bold mb-4 text-white">
                  Transform Your 
                  <br />
                  <span className="gradient-text" style={{ 
                    background: 'linear-gradient(45deg, #fff, #f8f9fa)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    Productivity
                  </span>
                </h1>
                
                {user ? (
                  <Link to="/dashboard" className="text-decoration-none">
                    <button className="btn-gradient me-3 d-inline-flex align-items-center">
                      <FaArrowRight className="me-2" />
                      Open Dashboard
                    </button>
                  </Link>
                ) : (
                  <div className="d-flex gap-3 flex-wrap">
                    <Link to="/register" className="text-decoration-none">
                      <button className="btn-gradient d-inline-flex align-items-center hover-lift">
                        <FaUserPlus className="me-2" />
                        Start Free Today
                      </button>
                    </Link>
                    <Link to="/login" className="text-decoration-none">
                      <button style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all var(--transition-base)',
                        backdropFilter: 'blur(10px)'
                      }} 
                      className="hover-lift d-inline-flex align-items-center"
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                      }}>
                        <FaSignInAlt className="me-2" />
                        Sign In
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </Col>
            
            <Col lg={6}>
              <div className="scale-in">
                {/* Dashboard Preview Card */}
                <div className="card-modern p-4" style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0 fw-bold" style={{ color: '#000' }}>Dashboard Preview</h5>
                    <button style={{
                      background: 'var(--primary-gradient)',
                      border: 'none',
                      color: 'white',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all var(--transition-base)'
                    }} className="hover-lift">
                      <FaPlay size={14} />
                    </button>
                  </div>
                  
                  {/* Mini Stats Cards */}
                  <Row className="g-3 mb-4">
                    <Col xs={4}>
                      <div style={{
                        background: 'var(--success-gradient)',
                        padding: '1rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        textAlign: 'center',
                        color: 'white'
                      }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>12</div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Completed</div>
                      </div>
                    </Col>
                    <Col xs={4}>
                      <div style={{
                        background: 'var(--primary-gradient)',
                        padding: '1rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        textAlign: 'center',
                        color: 'white'
                      }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>5</div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>In Progress</div>
                      </div>
                    </Col>
                    <Col xs={4}>
                      <div style={{
                        background: 'var(--warning-gradient)',
                        padding: '1rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        textAlign: 'center',
                        color: 'white'
                      }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>3</div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Pending</div>
                      </div>
                    </Col>
                  </Row>
                  
                  {/* Sample Tasks */}
                  <div className="mb-2">
                    <div className="d-flex align-items-center justify-content-between p-2 rounded" style={{
                      background: 'rgba(102, 126, 234, 0.1)',
                      borderLeft: '4px solid var(--primary-color)'
                    }}>
                      <span style={{ fontSize: '0.9rem', color: '#000' }}>Complete project proposal</span>
                      <span className="status-in_progress">In Progress</span>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="d-flex align-items-center justify-content-between p-2 rounded" style={{
                      background: 'rgba(17, 153, 142, 0.1)',
                      borderLeft: '4px solid var(--success-color)'
                    }}>
                      <span style={{ fontSize: '0.9rem', color: '#000' }}>Review team feedback</span>
                      <span className="status-completed">Completed</span>
                    </div>
                  </div>
                  <div>
                    <div className="d-flex align-items-center justify-content-between p-2 rounded" style={{
                      background: 'rgba(247, 183, 51, 0.1)',
                      borderLeft: '4px solid var(--warning-color)'
                    }}>
                      <span style={{ fontSize: '0.9rem', color: '#000' }}>Schedule client meeting</span>
                      <span className="priority-badge-high">High</span>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
        
        {/* CSS for floating animation */}
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}</style>
      </section>

      {/* Features Section */}
      <section className="py-5" style={{ background: 'var(--background-color)' }}>
        <Container>
          <Row className="mb-5">
            <Col className="text-center">
              <h2 className="display-5 fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                Powerful Features
              </h2>
              <p className="lead" style={{ color: 'var(--text-secondary)' }}>
                Everything you need to maximize your productivity
              </p>
            </Col>
          </Row>
          
          <Row className="g-4">
            <Col md={4}>
              <div className="card-modern h-100 hover-lift text-center p-4">
                <div style={{
                  background: 'var(--primary-gradient)',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  boxShadow: 'var(--shadow-glow)'
                }}>
                  <FaTasks size={32} color="white" />
                </div>
                <h4 className="fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                  Smart Task Management
                </h4>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Create, organize, and prioritize tasks with smart suggestions and intelligent categorization
                </p>
              </div>
            </Col>
            
            <Col md={4}>
              <div className="card-modern h-100 hover-lift text-center p-4">
                <div style={{
                  background: 'var(--warning-gradient)',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  boxShadow: 'var(--shadow-glow)'
                }}>
                  <FaClock size={32} color="white" />
                </div>
                <h4 className="fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                  Real-time Progress
                </h4>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Track your progress with beautiful visualizations and instant status updates across all devices
                </p>
              </div>
            </Col>
            
            <Col md={4}>
              <div className="card-modern h-100 hover-lift text-center p-4">
                <div style={{
                  background: 'var(--success-gradient)',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  boxShadow: 'var(--shadow-glow)'
                }}>
                  <FaChartBar size={32} color="white" />
                </div>
                <h4 className="fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                  Analytics & Insights
                </h4>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Gain deep insights into your productivity patterns with detailed analytics and performance metrics
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5" style={{
        background: 'linear-gradient(135deg, var(--accent-color) 0%, var(--primary-color) 100%)',
        color: 'white'
      }}>
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <h3 className="display-6 fw-bold mb-3">
                Ready to Transform Your Workflow?
              </h3>
              <p className="lead mb-4 opacity-75">
                Join thousands of professionals who have already boosted their productivity
              </p>
              {!user && (
                <Link to="/register" className="text-decoration-none">
                  <button className="btn-gradient" style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    backdropFilter: 'blur(10px)',
                    fontSize: '1.1rem',
                    padding: '1rem 2rem'
                  }}>
                    <FaUserPlus className="me-2" />
                    Start Your Free Trial
                  </button>
                </Link>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default HomePage;