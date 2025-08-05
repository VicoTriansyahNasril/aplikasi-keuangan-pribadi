/* src/components/layout/Header.jsx */
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTransactions } from '../../context/TransactionContext';
import { showConfirmation } from '../../utils/confirmation';
import { FaBars, FaSignOutAlt } from 'react-icons/fa';
import MobileMenu from './MobileMenu';
import styles from './Header.module.css';

const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

const Header = () => {
  const { totalBalance, loading } = useTransactions();
  const { logout } = useAuth();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmed = await showConfirmation({
      title: 'Konfirmasi Logout',
      text: 'Anda yakin ingin keluar dari sesi ini?',
      confirmButtonText: 'Ya, Logout',
      icon: 'question'
    });

    if (confirmed) {
      try {
        await logout();
        navigate('/login');
      } catch (error) {
        console.error("Gagal untuk logout", error);
      }
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}><Link to="/dashboard">FinanceApp</Link></div>
        <div className={styles.desktopNav}>
          <div className={styles.balanceInfo}>
            <span>Total Saldo:</span>
            <span className={styles.balanceAmount}>{loading ? '...' : formatCurrency(totalBalance)}</span>
          </div>
          <nav className={styles.nav}>
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? styles.active : '')}>Dashboard</NavLink>
            <NavLink to="/transactions" className={({ isActive }) => (isActive ? styles.active : '')}>Transaksi</NavLink>
            <NavLink to="/analytics" className={({ isActive }) => (isActive ? styles.active : '')}>Analisis</NavLink>
            <NavLink to="/budget" className={({ isActive }) => (isActive ? styles.active : '')}>Anggaran</NavLink>
            <NavLink to="/accounts" className={({ isActive }) => (isActive ? styles.active : '')}>Akun</NavLink>
            <NavLink to="/goals" className={({ isActive }) => (isActive ? styles.active : '')}>Tujuan</NavLink>
            <NavLink to="/recurring" className={({ isActive }) => (isActive ? styles.active : '')}>Berulang</NavLink>
            <NavLink to="/settings" className={({ isActive }) => (isActive ? styles.active : '')}>Pengaturan</NavLink>
          </nav>
          <button onClick={handleLogout} className={styles.logoutButton} title="Logout"><FaSignOutAlt /></button>
        </div>
        <button className={styles.hamburgerButton} onClick={() => setMenuOpen(true)}><FaBars /></button>
      </header>
      <MobileMenu isOpen={isMenuOpen} onClose={() => setMenuOpen(false)} onLogout={handleLogout} />
    </>
  );
};

export default Header;