import React from 'react';

const ProgressBar = ({ value = 0 }) => (
  <div className="progress-bar">
    <div className="progress-fill" style={{ width: `${value}%` }} />
  </div>
);

export default ProgressBar;
