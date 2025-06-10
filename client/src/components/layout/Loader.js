// src/components/layout/Loader.js - Enhanced loading component with modern animations
import React from 'react';

const Loader = ({ size = 'md', variant = 'primary', centered = true, type = 'spinner' }) => {
  const getSize = () => {
    switch (size) {
      case 'sm': return '24px';
      case 'lg': return '48px';
      default: return '32px';
    }
  };

  const ModernSpinner = () => (
    <div className="loading-pulse" style={{
      width: getSize(),
      height: getSize(),
      border: '3px solid var(--border-light)',
      borderTop: '3px solid var(--primary-color)',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      position: 'relative'
    }}>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  const DotsLoader = () => (
    <div className="d-flex align-items-center gap-1">
      <div style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: 'var(--primary-color)',
        animation: 'bounce 1.4s ease-in-out infinite both'
      }}></div>
      <div style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: 'var(--primary-color)',
        animation: 'bounce 1.4s ease-in-out 0.16s infinite both'
      }}></div>
      <div style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: 'var(--primary-color)',
        animation: 'bounce 1.4s ease-in-out 0.32s infinite both'
      }}></div>
      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );

  const PulseLoader = () => (
    <div style={{
      width: getSize(),
      height: getSize(),
      borderRadius: '50%',
      background: 'var(--primary-gradient)',
      animation: 'pulse 2s ease-in-out infinite',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        background: 'var(--primary-gradient)',
        opacity: 0.6,
        animation: 'pulse 2s ease-in-out infinite',
        animationDelay: '1s'
      }}></div>
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );

  const getLoaderComponent = () => {
    switch (type) {
      case 'dots': return <DotsLoader />;
      case 'pulse': return <PulseLoader />;
      default: return <ModernSpinner />;
    }
  };

  const loader = (
    <div className="d-flex flex-column align-items-center">
      {getLoaderComponent()}
      <span className="sr-only">Loading...</span>
      {size !== 'sm' && (
        <p style={{ 
          color: 'var(--text-muted)', 
          fontSize: '0.875rem', 
          marginTop: '1rem',
          marginBottom: 0 
        }}>
          Loading...
        </p>
      )}
    </div>
  );

  if (centered) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-80 fade-in">
        <div className="glass-card p-4">
          {loader}
        </div>
      </div>
    );
  }

  return loader;
};

export default Loader;