// components/WarningModal.jsx
import React from "react";
import "./WarningModal.css";

const WarningModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay-warning">
      <div className="modal-content-warning">
        <h3>Warning</h3>
        <div className="modal-message">
          You will lose unsaved data if you refresh. Continue?
        </div>
        <div className="modal-button-group">
          <button className="btn-confirm" onClick={onConfirm}>
            Yes, Refresh
          </button>
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;
