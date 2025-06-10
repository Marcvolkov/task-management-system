// src/components/layout/Header.js - Modern header component
import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Dropdown, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaTasks, FaUser, FaSignOutAlt, FaBell, FaMoon, FaSun, FaSearch, FaCog } from 'react-icons/fa';
import { logout } from '../../redux/slices/authSlice';
import { useTheme } from '../../contexts/ThemeContext';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stats } = useSelector((state) => state.tasks);
  const { toggleTheme, isDark } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showSearch, setShowSearch] = useState(false);

  // Mock notifications - in a real app, this would come from an API
  useEffect(() => {
    if (user && stats) {
      const mockNotifications = [];
      
      if (stats.high_priority > 0) {
        mockNotifications.push({
          id: 1,
          type: 'warning',
          message: `You have ${stats.high_priority} high priority task${stats.high_priority > 1 ? 's' : ''}`,
          time: '5 min ago',
          unread: true
        });
      }
      
      if (stats.completed > 0) {
        mockNotifications.push({
          id: 2,
          type: 'success',
          message: `Great job! You completed ${stats.completed} task${stats.completed > 1 ? 's' : ''}`,
          time: '1 hour ago',
          unread: false
        });
      }
      
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => n.unread).length);
    }
  }, [user, stats]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, unread: false } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return (
    <Navbar 
      variant={isDark ? 'dark' : 'light'}
      expand="lg" 
      sticky="top" 
      style={{
        background: isDark 
          ? 'rgba(30, 41, 59, 0.95)' 
          : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(226, 232, 240, 0.8)'}`,
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <Container>
        <Navbar.Brand 
          as={Link} 
          to="/" 
          className="d-flex align-items-center fw-bold"
        >
          <div style={{
            background: 'var(--primary-gradient)',
            padding: '0.5rem',
            borderRadius: 'var(--radius-md)',
            marginRight: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FaTasks color="white" size={20} />
          </div>
          TaskFlow
        </Navbar.Brand>
        
        <Navbar.Toggle 
          aria-controls="basic-navbar-nav"
          style={{
            border: 'none',
            boxShadow: 'none',
          }}
        />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {user ? (
              <>
                {/* Dashboard Link */}
                <Nav.Link 
                  as={Link} 
                  to="/dashboard"
                  className="fw-semibold mx-1"
                  style={{ 
                    borderRadius: 'var(--radius-md)',
                    padding: '0.5rem 1rem',
                    transition: 'all var(--transition-base)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--border-light)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                  }}
                >
                  Dashboard
                </Nav.Link>

                {/* Search Button */}
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-md)',
                    margin: '0 0.25rem',
                    cursor: 'pointer',
                    transition: 'all var(--transition-base)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--border-light)';
                    e.target.style.color = 'var(--primary-color)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = 'var(--text-secondary)';
                  }}
                >
                  <FaSearch size={16} />
                </button>

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-md)',
                    margin: '0 0.25rem',
                    cursor: 'pointer',
                    transition: 'all var(--transition-base)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--border-light)';
                    e.target.style.color = 'var(--primary-color)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = 'var(--text-secondary)';
                  }}
                >
                  {isDark ? <FaSun size={16} /> : <FaMoon size={16} />}
                </button>

                {/* Notifications */}
                <Dropdown align="end">
                  <Dropdown.Toggle
                    as="button"
                    id="dropdown-notifications"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-md)',
                      margin: '0 0.25rem',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'all var(--transition-base)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'var(--border-light)';
                      e.target.style.color = 'var(--primary-color)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = 'var(--text-secondary)';
                    }}
                  >
                    <FaBell size={16} />
                    {unreadCount > 0 && (
                      <Badge 
                        bg="danger" 
                        pill
                        style={{
                          position: 'absolute',
                          top: '0.25rem',
                          right: '0.25rem',
                          fontSize: '0.6rem',
                          minWidth: '1rem',
                          height: '1rem'
                        }}
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </Dropdown.Toggle>
                  
                  <Dropdown.Menu
                    style={{
                      background: 'var(--surface-color)',
                      border: `1px solid var(--border-color)`,
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-lg)',
                      minWidth: '280px',
                      maxHeight: '400px',
                      overflowY: 'auto'
                    }}
                  >
                    <div className="px-3 py-2 border-bottom">
                      <h6 className="mb-0 fw-bold" style={{ color: 'var(--text-primary)' }}>
                        Notifications
                      </h6>
                    </div>
                    
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <Dropdown.Item
                          key={notification.id}
                          onClick={() => markNotificationAsRead(notification.id)}
                          style={{
                            background: notification.unread ? 'var(--border-light)' : 'transparent',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            margin: '0.25rem',
                            padding: '0.75rem'
                          }}
                        >
                          <div className="d-flex align-items-start">
                            <div style={{
                              background: notification.type === 'warning' ? 'var(--warning-color)' : 'var(--success-color)',
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              marginTop: '0.25rem',
                              marginRight: '0.75rem',
                              flexShrink: 0
                            }}></div>
                            <div>
                              <p className="mb-1" style={{ 
                                fontSize: '0.9rem', 
                                color: 'var(--text-primary)',
                                fontWeight: notification.unread ? '600' : '400'
                              }}>
                                {notification.message}
                              </p>
                              <small style={{ color: 'var(--text-muted)' }}>
                                {notification.time}
                              </small>
                            </div>
                          </div>
                        </Dropdown.Item>
                      ))
                    ) : (
                      <div className="px-3 py-4 text-center">
                        <p className="mb-0" style={{ color: 'var(--text-muted)' }}>
                          No notifications yet
                        </p>
                      </div>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
                
                {/* User Dropdown */}
                <Dropdown align="end">
                  <Dropdown.Toggle
                    as="button"
                    id="dropdown-user"
                    className="d-flex align-items-center"
                    style={{
                      background: 'transparent',
                      border: `2px solid var(--border-color)`,
                      borderRadius: 'var(--radius-lg)',
                      padding: '0.5rem 1rem',
                      margin: '0 0.5rem',
                      cursor: 'pointer',
                      transition: 'all var(--transition-base)',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = 'var(--primary-color)';
                      e.target.style.background = 'var(--border-light)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = 'var(--border-color)';
                      e.target.style.background = 'transparent';
                    }}
                  >
                    <div style={{
                      background: 'var(--primary-gradient)',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '0.5rem'
                    }}>
                      <FaUser size={14} color="white" />
                    </div>
                    <span className="fw-semibold">{user.username}</span>
                  </Dropdown.Toggle>
                  
                  <Dropdown.Menu
                    style={{
                      background: 'var(--surface-color)',
                      border: `1px solid var(--border-color)`,
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-lg)',
                      minWidth: '200px'
                    }}
                  >
                    <div className="px-3 py-2 border-bottom">
                      <p className="mb-0 fw-bold" style={{ color: 'var(--text-primary)' }}>
                        {user.username}
                      </p>
                      <small style={{ color: 'var(--text-muted)' }}>
                        {user.email}
                      </small>
                    </div>
                    
                    <Dropdown.Item 
                      as={Link} 
                      to="/profile"
                      style={{
                        color: 'var(--text-primary)',
                        borderRadius: 'var(--radius-md)',
                        margin: '0.25rem',
                        transition: 'all var(--transition-base)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'var(--primary-color)';
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = 'var(--text-primary)';
                      }}
                    >
                      <FaUser className="me-2" />
                      Profile
                    </Dropdown.Item>
                    
                    <Dropdown.Item 
                      href="#"
                      style={{
                        color: 'var(--text-primary)',
                        borderRadius: 'var(--radius-md)',
                        margin: '0.25rem',
                        transition: 'all var(--transition-base)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'var(--primary-color)';
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = 'var(--text-primary)';
                      }}
                    >
                      <FaCog className="me-2" />
                      Settings
                    </Dropdown.Item>
                    
                    <Dropdown.Divider />
                    
                    <Dropdown.Item 
                      onClick={handleLogout}
                      style={{
                        color: 'var(--error-color)',
                        borderRadius: 'var(--radius-md)',
                        margin: '0.25rem'
                      }}
                    >
                      <FaSignOutAlt className="me-2" />
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                {/* Theme Toggle for non-authenticated users */}
                <button
                  onClick={toggleTheme}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-md)',
                    margin: '0 0.25rem',
                    cursor: 'pointer',
                    transition: 'all var(--transition-base)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--border-light)';
                    e.target.style.color = 'var(--primary-color)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = 'var(--text-secondary)';
                  }}
                >
                  {isDark ? <FaSun size={16} /> : <FaMoon size={16} />}
                </button>

                <Nav.Link 
                  as={Link} 
                  to="/login"
                  className="fw-semibold mx-1"
                  style={{ 
                    borderRadius: 'var(--radius-md)',
                    padding: '0.5rem 1rem',
                    transition: 'all var(--transition-base)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--border-light)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                  }}
                >
                  Login
                </Nav.Link>
                
                <Link to="/register" className="text-decoration-none">
                  <button 
                    className="btn-gradient"
                    style={{
                      fontSize: '0.9rem',
                      padding: '0.5rem 1.25rem',
                      margin: '0 0.5rem'
                    }}
                  >
                    Get Started
                  </button>
                </Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;