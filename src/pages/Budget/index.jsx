/* src/pages/Budget/index.jsx */
import React, { useState } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { formatNumberInput, parseFormattedNumber } from '../../utils/formatting';
import Button from '../../components/ui/Button';
import styles from './Budget.module.css';

const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

const BudgetPage = () => {
  const { budgets, setBudgetForCategory, categories } = useTransactions();
  const [editingCategory, setEditingCategory] = useState(null);
  const [amount, setAmount] = useState('');

  const handleEdit = (category, currentAmount) => {
    setEditingCategory(category);
    setAmount(formatNumberInput(currentAmount));
  };

  const handleSave = (e, category) => {
    e.preventDefault();
    const parsedAmount = parseFormattedNumber(amount);
    setBudgetForCategory(category, parsedAmount);
    setEditingCategory(null);
    setAmount('');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Kelola Anggaran</h1>
      <p className={styles.subtitle}>Atur batas pengeluaran bulanan untuk setiap kategori untuk membantu mengontrol pengeluaran Anda.</p>
      
      <div className={styles.budgetList}>
        {categories.map(category => (
          <div key={category} className={styles.budgetItem}>
            <span className={styles.categoryName}>{category}</span>
            {editingCategory === category ? (
              <form onSubmit={(e) => handleSave(e, category)} className={styles.editForm}>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(formatNumberInput(e.target.value))}
                  className={styles.input}
                  placeholder="e.g., 500.000"
                  autoFocus
                />
                <Button type="submit">Simpan</Button>
                <Button onClick={() => setEditingCategory(null)} variant="secondary" type="button">Batal</Button>
              </form>
            ) : (
              <div className={styles.displayMode}>
                <span className={styles.amount}>{budgets[category] ? formatCurrency(budgets[category]) : 'Belum diatur'}</span>
                <Button onClick={() => handleEdit(category, budgets[category] || 0)}>
                  {budgets[category] ? 'Ubah' : 'Atur'}
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetPage;