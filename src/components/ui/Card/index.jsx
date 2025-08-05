/* src/components/ui/Card/index.jsx */
import React from 'react';
import styles from './Card.module.css';
import { motion } from 'framer-motion';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const Card = ({ title, amount, icon, type }) => {
  const amountClass = type ? styles[type] : '';

  return (
    <motion.div
      className={styles.card}
      whileHover={{ y: -5, boxShadow: 'var(--box-shadow-md)' }}
    >
      <div className={styles.cardHeader}>
        {icon && <span style={{ fontSize: '1.5rem', color: 'var(--color-text-secondary)' }}>{icon}</span>}
        <h3 className={styles.cardTitle}>{title}</h3>
      </div>
      <p className={`${styles.cardContent} ${amountClass}`}>
        {formatCurrency(amount)}
      </p>
    </motion.div>
  );
};

export default Card;