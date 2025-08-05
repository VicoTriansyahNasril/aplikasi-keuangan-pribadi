/* src/components/feature/BudgetList/index.jsx */
import React from 'react';
import { useTransactions } from '../../../context/TransactionContext';
import ProgressBar from '../../ui/ProgressBar';
import styles from './BudgetList.module.css';

const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

const BudgetList = () => {
  const { transactions, budgets } = useTransactions();

  const expenseByCategory = transactions
    .filter(t => t.type === 'Pengeluaran')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const budgetEntries = Object.entries(budgets);

  if (budgetEntries.length === 0) {
    return <p className={styles.noBudget}>Anda belum menetapkan anggaran. Mulai di halaman Anggaran.</p>;
  }

  return (
    <div className={styles.container}>
      {budgetEntries.map(([category, limit]) => {
        const spent = expenseByCategory[category] || 0;
        return (
          <div key={category} className={styles.budgetItem}>
            <div className={styles.header}>
              <h3 className={styles.categoryName}>{category}</h3>
            </div>
            <ProgressBar value={spent} max={limit} />
            <p className={styles.amountInfo}>
              <span className={styles.spent}>{formatCurrency(spent)}</span> / <span className={styles.limit}>{formatCurrency(limit)}</span>
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default BudgetList;