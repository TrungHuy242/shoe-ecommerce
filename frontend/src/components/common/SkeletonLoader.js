// frontend/src/components/common/SkeletonLoader.js
import React from 'react';
import './SkeletonLoader.css';

const SkeletonLoader = ({ type = 'card', count = 1, className = '' }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`skeleton-card ${className}`}>
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-title"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-price"></div>
            </div>
          </div>
        );
      
      case 'list':
        return (
          <div className={`skeleton-list ${className}`}>
            <div className="skeleton-avatar"></div>
            <div className="skeleton-content">
              <div className="skeleton-title"></div>
              <div className="skeleton-text"></div>
            </div>
          </div>
        );
      
      case 'table':
        return (
          <div className={`skeleton-table ${className}`}>
            <div className="skeleton-row">
              <div className="skeleton-cell"></div>
              <div className="skeleton-cell"></div>
              <div className="skeleton-cell"></div>
              <div className="skeleton-cell"></div>
            </div>
          </div>
        );
      
      case 'dashboard':
        return (
          <div className={`skeleton-dashboard ${className}`}>
            <div className="skeleton-stat">
              <div className="skeleton-icon"></div>
              <div className="skeleton-stat-content">
                <div className="skeleton-stat-title"></div>
                <div className="skeleton-stat-value"></div>
              </div>
            </div>
          </div>
        );
      
      default:
        return <div className={`skeleton-default ${className}`}></div>;
    }
  };

  if (count === 1) {
    return renderSkeleton();
  }

  return (
    <div className="skeleton-container">
      {Array.from({ length: count }, (_, index) => (
        <React.Fragment key={index}>
          {renderSkeleton()}
        </React.Fragment>
      ))}
    </div>
  );
};

export default SkeletonLoader;
