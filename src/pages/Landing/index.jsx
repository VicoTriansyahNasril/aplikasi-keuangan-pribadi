/* src/pages/Landing/index.jsx */
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';
import styles from './Landing.module.css';

const LandingPage = () => {
  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className={styles.title}>Selamat Datang di FinanceApp</h1>
      <p className={styles.subtitle}>
        Aplikasi manajemen keuangan pribadi yang modern dan intuitif untuk membantu Anda melacak setiap pemasukan dan pengeluaran dengan mudah.
      </p>
      <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
        <Link to="/register">
          <Button size="large" variant="primary">Buat Akun Gratis</Button>
        </Link>
        <Link to="/login">
          <Button size="large" variant="secondary">Login</Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default LandingPage;