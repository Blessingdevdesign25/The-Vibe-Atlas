import React from 'react';
import '../styles/SkeletonCard.css';

const SkeletonCard: React.FC = () => {
  return (
    <div className="skeleton-card glass shimmer">
      <div className="skeleton-content"></div>
    </div>
  );
};

export default SkeletonCard;
