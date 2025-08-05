// src/components/ui/Modal/index.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import styles from './Modal.module.css';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <FaTimes />
        </button>
        <h2 className={styles.modalHeader}>{title}</h2>
        {children}
      </div>
    </div>,
    document.getElementById('portal') // Kita perlu tambahkan div ini di index.html
  );
};

export default Modal;