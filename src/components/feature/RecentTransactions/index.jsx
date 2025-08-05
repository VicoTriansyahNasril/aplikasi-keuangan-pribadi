/* src/components/feature/RecentTransactions/index.jsx */
import React from 'react';
import { useTransactions } from '../../../context/TransactionContext';
import styles from './RecentTransactions.module.css';

const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
const formatDateShort = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

const RecentTransactions = () => {
  const { transactions } = useTransactions();
  const recent = transactions.slice(0, 5);

  if (recent.length === 0) {
    return <p className={styles.noTransactions}>Belum ada transaksi.</p>;
  }

  return (
    <ul className={styles.list}>
      {recent.map(t => (
        <li key={t.id} className={styles.item}>
          <div className={styles.leftSection}>
            <p className={styles.description}>{t.description}</p>
            <div className={styles.details}>
              <span>{formatDateShort(t.date)}</span>
              <span className={styles.category}>{t.category}</span>
            </div>
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