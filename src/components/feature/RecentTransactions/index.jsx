// src/components/feature/RecentTransactions/index.jsx
import React from 'react';
import { useTransactions } from '../../../context/TransactionContext';
import styles from './RecentTransactions.module.css';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const RecentTransactions = () => {
  const { transactions } = useTransactions();
  const recent = transactions.slice(0, 5); // Ambil 5 transaksi teratas

  if (recent.length === 0) {
    return <p className={styles.noTransactions}>Belum ada transaksi.</p>;
  }

  return (
    <ul className={styles.list}>
      {recent.map(t => (
        <li key={t.id} className={styles.item}>
          <div>
            <p className={styles.description}>{t.description}</p>
            <span className={styles.category}>{t.category}</span>
          </div>
          <p className={`${styles.amount} ${t.type === 'Pemasukan' ? styles.income : styles.expense}`}>
            {t.type === 'Pengeluaran' ? '-' : ''}{formatCurrency(t.amount)}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default RecentTransactions;