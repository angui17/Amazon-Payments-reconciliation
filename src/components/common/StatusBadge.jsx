import React from 'react';

const StatusBadge = ({ status }) => {
  const map = { success: 'status-success', error: 'status-error', pending: 'status-pending' };
  return <span className={`status-badge ${map[status] || ''}`}>{status}</span>;
}

export default StatusBadge;
