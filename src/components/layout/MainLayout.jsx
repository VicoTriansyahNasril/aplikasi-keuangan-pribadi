/* src/components/layout/MainLayout.jsx */
import React from 'react';
import Header from './Header';
import { motion } from 'framer-motion';

const MainLayout = ({ children }) => {
  const mainContentStyle = {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: 'var(--spacing-lg)',
    width: '100%', 
  };

  return (
    <div style={{ overflowX: 'hidden' }}>
      <Header />
      <motion.main
        style={mainContentStyle}
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