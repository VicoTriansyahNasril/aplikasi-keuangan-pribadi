/* src/components/layout/MainLayout.jsx */
import React from 'react';
import Header from './Header';
import { motion } from 'framer-motion';
import styles from './MainLayout.module.css';

const MainLayout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Header />
      <motion.main
        className={styles.mainContent}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.main>
    </div>
  );
};

export default MainLayout;