// src/components/ui/Button/index.jsx
import React from 'react';
import styles from './Button.module.css';

const Button = ({ children, onClick, variant = 'primary', type = 'button', icon }) => {
  const variantClass = styles[variant];

  return (
    <button
      type={type}
      className={`${styles.button} ${variantClass}`}
      onClick={onClick}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;