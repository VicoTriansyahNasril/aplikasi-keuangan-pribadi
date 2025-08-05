/* src/pages/Register/index.jsx */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from '../Login/Auth.module.css';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Password tidak cocok!");
    }
    setLoading(true);
    try {
      await register(email, password);
      toast.success('Registrasi berhasil! Selamat datang.');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Gagal melakukan registrasi. Coba lagi.');
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <motion.div className={styles.formWrapper} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={styles.title}>Registrasi</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}><label htmlFor="email" className={styles.label}>Email</label><input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input} required /></div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <div className={styles.passwordWrapper}>
              <input type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} className={styles.input} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className={styles.passwordToggle}>{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>Konfirmasi Password</label>
            <div className={styles.passwordWrapper}>
              <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={styles.input} required />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={styles.passwordToggle}>{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</button>
            </div>
          </div>
          <Button type="submit" variant="primary" disabled={loading}>{loading ? 'Loading...' : 'Daftar'}</Button>
        </form>
        <p className={styles.footerText}>Sudah punya akun? <Link to="/login">Login di sini</Link></p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;