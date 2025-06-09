// src/pages/ProfilePage.js - Страница профиля
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Tab, Tabs } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaUser, FaEnvelope, FaLock, FaSave } from 'react-icons/fa';
import { updateProfile, changePassword, reset } from '../redux/slices/authSlice';
import Alert from '../components/common/Alert';
import Loader from '../components/layout/Loader';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username,
        email: user.email,
      });
    }
  }, [user]);

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        dispatch(reset());
      }, 3000);
    }
  }, [isSuccess, dispatch]);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
    setPasswordError('');
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile(profileData));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    dispatch(changePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    }));

    // Clear form on success
    if (!isError) {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <h2 className="mb-4">Profile Settings</h2>
              
              {isSuccess && (
                <Alert
                  variant="success"
                  message={message}
                  onClose={() => dispatch(reset())}
                />
              )}
              
              {isError && (
                <Alert
                  variant="danger"
                  message={message}
                  onClose={() => dispatch(reset())}
                />
              )}

              <Tabs defaultActiveKey="profile" className="mb-4">
                <Tab eventKey="profile" title="Profile Information">
                  <Form onSubmit={handleProfileSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaUser className="me-2" />
                        Username
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        value={profileData.username}
                        onChange={handleProfileChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>
                        <FaEnvelope className="me-2" />
                        Email
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        required
                      />
                    </Form.Group>

                    <Button variant="primary" type="submit" disabled={isLoading}>
                      <FaSave className="me-2" />
                      Save Changes
                    </Button>
                  </Form>
                </Tab>

                <Tab eventKey="security" title="Security">
                  {passwordError && (
                    <Alert
                      variant="danger"
                      message={passwordError}
                      onClose={() => setPasswordError('')}
                    />
                  )}
                  
                  <Form onSubmit={handlePasswordSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaLock className="me-2" />
                        Current Password
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaLock className="me-2" />
                        New Password
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Minimum 6 characters"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>
                        <FaLock className="me-2" />
                        Confirm New Password
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </Form.Group>

                    <Button variant="primary" type="submit" disabled={isLoading}>
                      <FaLock className="me-2" />
                      Change Password
                    </Button>
                  </Form>
                </Tab>

                <Tab eventKey="account" title="Account">
                  <div className="text-center py-4">
                    <h5>Account Information</h5>
                    <p className="text-muted mb-4">
                      Member since: {user && new Date(user.createdAt || user.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-danger">
                      <strong>Danger Zone</strong><br />
                      Account deletion is permanent and cannot be undone.
                    </p>
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;