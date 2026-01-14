import React from 'react';

const Modal = ({ title, children, onClose }) => (
  <div className="modal">
    <div className="modal-content">
      <div className="modal-header">
        <h3>{title}</h3>
        <button onClick={onClose}>×</button>
      </div>
      <div className="modal-body">{children}</div>
    </div>
  </div>
);

export default Modal;
