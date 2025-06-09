// src/components/common/Alert.js - Компонент для отображения уведомлений
import React from 'react';
import { Alert as BootstrapAlert } from 'react-bootstrap';

const Alert = ({ variant = 'info', message, onClose, dismissible = true }) => {
  if (!message) return null;

  return (
    <BootstrapAlert
      variant={variant}
      onClose={onClose}
      dismissible={dismissible}
      className="fade-in"
    >
      {message}
    </BootstrapAlert>
  );
};

export default Alert;