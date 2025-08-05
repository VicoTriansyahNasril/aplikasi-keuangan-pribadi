/* src/pages/Dashboard/index.jsx */
import React, { useState } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import TransactionForm from '../../components/feature/TransactionForm';
import RecentTransactions from '../../components/feature/RecentTransactions';
import BudgetList from '../../components/feature/BudgetList';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { FaWallet, FaArrowUp, FaArrowDown, FaPlus } from 'react-icons/fa';

const styles = {
  pageHeader: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' },
  headerInfo: {},
  title: { fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-text-primary)' },
  subtitle: { fontSize: '1.1rem', color: 'var(--color-text-secondary)' },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' },
  sectionContainer: { backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-lg)', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--color-border)', marginBottom: 'var(--spacing-xl)' },
  sectionTitle: { fontSize: '1.2rem', fontWeight: '600', marginBottom: 'var(--spacing-lg)', color: 'var(--color-text-secondary)' },
};

const DashboardPage = () => {
  const { totalBalance, income, expense, loading } = useTransactions();
  const [isModalOpen, setModalOpen] = useState(false);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <header style={styles.pageHeader}>
        <div style={styles.headerInfo}>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.subtitle}>Ringkasan kondisi keuangan Anda.</p>
        </div>
        <Button onClick={() => setModalOpen(true)} icon={<FaPlus />}>
          Tambah Transaksi
        </Button>
      </header>

      <section style={styles.summaryGrid}>
        <Card title="Total Saldo" amount={totalBalance} icon={<FaWallet />} />
        <Card title="Total Pemasukan (Bulan Ini)" amount={income} icon={<FaArrowUp />} type="income" />
        <Card title="Total Pengeluaran (Bulan Ini)" amount={expense} icon={<FaArrowDown />} type="expense" />
      </section>

      <div style={styles.sectionContainer}>
        <h2 style={styles.sectionTitle}>Ringkasan Anggaran</h2>
        <BudgetList />
      </div>

      <div style={styles.sectionContainer}>
        <h2 style={styles.sectionTitle}>Transaksi Terbaru</h2>
        <RecentTransactions />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Tambah Transaksi Baru">
        <TransactionForm onClose={() => setModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default DashboardPage;