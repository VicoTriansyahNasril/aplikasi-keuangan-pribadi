/* src/components/ui/EmptyState/index.jsx */
import React from 'react';
import styles from './EmptyState.module.css';

const EmptyState = ({ icon, title, message }) => {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>
    </div>
  );
};

export default EmptyState;