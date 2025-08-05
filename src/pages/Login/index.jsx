/* src/pages/Login/index.jsx */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from './Auth.module.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login berhasil!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Gagal login. Periksa kembali email dan password Anda.');
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <motion.div className={styles.formWrapper} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={styles.title}>Login</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}><label htmlFor="email" className={styles.label}>Email</label><input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input} required /></div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <div className={styles.passwordWrapper}>
              <input type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} className={styles.input} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className={styles.passwordToggle}>{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
            </div>
          </div>
          <Button type="submit" variant="primary" disabled={loading}>{loading ? 'Loading...' : 'Login'}</Button>
        </form>
        <p className={styles.footerText}>Belum punya akun? <Link to="/register">Daftar di sini</Link></p>
      </motion.div>
    </div>
  );
};

export default LoginPage;