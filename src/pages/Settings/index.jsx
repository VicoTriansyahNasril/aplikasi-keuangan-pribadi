/* src/pages/Settings/index.jsx */
import React, { useState } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import Button from '../../components/ui/Button';
import ToggleSwitch from '../../components/ui/ToggleSwitch';
import { FaPlus, FaTrash } from 'react-icons/fa';
import styles from './Settings.module.css';

const SettingsPage = () => {
  const { categories, addCategory, deleteCategory, theme, toggleTheme } = useTransactions();
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = (e) => {
    e.preventDefault(); // Mencegah form reload halaman
    if (newCategory.trim()) {
      addCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Pengaturan</h1>
      
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Tema Tampilan</h2>
        <div className={styles.themeToggle}>
          <ToggleSwitch checked={theme === 'dark'} onChange={toggleTheme} />
          <span>Mode {theme === 'dark' ? 'Gelap' : 'Terang'}</span>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Kelola Kategori</h2>
        <form onSubmit={handleAddCategory} className={styles.categoryInput}>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Nama kategori baru"
            className={styles.input}
          />
          <Button type="submit" icon={<FaPlus />}>Tambah</Button>
        </form>
        <ul className={styles.categoryList}>
          {categories.map(cat => (
            <li key={cat} className={styles.categoryItem}>
              <span>{cat}</span>
              <button onClick={() => deleteCategory(cat)} className={styles.deleteButton} title={`Hapus ${cat}`}><FaTrash /></button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SettingsPage;