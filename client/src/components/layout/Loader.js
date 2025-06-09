// src/components/layout/Loader.js - Компонент загрузки
import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loader = ({ size = 'md', variant = 'primary', centered = true }) => {
  const spinnerSize = size === 'sm' ? 'sm' : undefined;
  
  const spinner = (
    <Spinner
      animation="border"
      variant={variant}
      size={spinnerSize}
      role="status"
    >
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );

  if (centered) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-80">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Loader;