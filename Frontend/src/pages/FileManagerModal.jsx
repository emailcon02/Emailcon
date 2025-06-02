// FileManagerModal.jsx
import React from 'react';
import ReactDOM from 'react-dom';

const FileManagerModal = ({ activeTablayout, children }) => {
  if (!activeTablayout) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay-file-editor">
      {children}
    </div>,
    document.body
  );
};

export default FileManagerModal;
