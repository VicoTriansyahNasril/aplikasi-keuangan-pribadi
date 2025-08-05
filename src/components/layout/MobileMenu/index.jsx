/* src/components/layout/MobileMenu/index.jsx */
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTimes, FaSignOutAlt } from 'react-icons/fa';
import styles from './MobileMenu.module.css';

const MobileMenu = ({ isOpen, onClose, onLogout }) => {
  const handleLogoutClick = () => {
    onClose();
    onLogout();
  };

  return (
    <>
      <div className={`${styles.backdrop} ${isOpen ? styles.open : ''}`} onClick={onClose} />
      <div className={`${styles.menu} ${isOpen ? styles.open : ''}`}>
        <button className={styles.closeButton} onClick={onClose}>
          <FaTimes />
        </button>
        <nav className={styles.navLinks}>
          <NavLink to="/dashboard" onClick={onClose} className={({ isActive }) => (isActive ? styles.active : '')}>Dashboard</NavLink>
          <NavLink to="/transactions" onClick={onClose} className={({ isActive }) => (isActive ? styles.active : '')}>Transaksi</NavLink>
          <NavLink to="/analytics" onClick={onClose} className={({ isActive }) => (isActive ? styles.active : '')}>Analisis</NavLink>
          <NavLink to="/budget" onClick={onClose} className={({ isActive }) => (isActive ? styles.active : '')}>Anggaran</NavLink>
          <NavLink to="/accounts" onClick={onClose} className={({ isActive }) => (isActive ? styles.active : '')}>Akun</NavLink>
          <NavLink to="/goals" onClick={onClose} className={({ isActive }) => (isActive ? styles.active : '')}>Tujuan</NavLink>
          <NavLink to="/recurring" onClick={onClose} className={({ isActive }) => (isActive ? styles.active : '')}>Berulang</NavLink>
          <NavLink to="/settings" onClick={onClose} className={({ isActive }) => (isActive ? styles.active : '')}>Pengaturan</NavLink>
        </nav>
        <button className={styles.logoutButton} onClick={handleLogoutClick}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </>
  );
};

export default MobileMenu;