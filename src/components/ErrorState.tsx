import React from 'react';
import '../styles/ErrorState.css';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="error-state glass">
      <div className="error-icon">⚡</div>
      <h3>Vibe Interruption</h3>
      <p>{message}</p>
      <button className="retry-btn" onClick={onRetry}>
        Try Again
      </button>
    </div>
  );
};

export default ErrorState;
