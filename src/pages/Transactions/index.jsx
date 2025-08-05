/* src/pages/Transactions/index.jsx */
import React, { useState, useMemo } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { showConfirmation } from '../../utils/confirmation';
import Table from '../../components/ui/Table';
import SearchInput from '../../components/ui/SearchInput';
import EmptyState from '../../components/ui/EmptyState';
import { FaTrash, FaEdit, FaFileInvoiceDollar } from 'react-icons/fa';
import Modal from '../../components/ui/Modal';
import TransactionForm from '../../components/feature/TransactionForm';
import tableStyles from '../../components/ui/Table/Table.module.css';

const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
const getWeekAgoDate = () => new Date(new Date().setDate(new Date().getDate() - 7));
const getMonthAgoDate = () => new Date(new Date().setMonth(new Date().getMonth() - 1));

const TransactionsPage = () => {
  const { transactions, deleteTransaction } = useTransactions();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [dateFilter, setDateFilter] = useState('all');

  const filteredTransactions = useMemo(() => {
    let dateFiltered = transactions;
    if (dateFilter !== 'all') {
      const filterDate = { '7d': getWeekAgoDate(), '30d': getMonthAgoDate() }[dateFilter];
      dateFiltered = transactions.filter(t => new Date(t.date) >= filterDate);
    }
    return dateFiltered.filter(t => t.description.toLowerCase().includes(searchTerm.toLowerCase()) || t.category.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [transactions, searchTerm, dateFilter]);

  const handleDelete = async (id, description) => {
    const confirmed = await showConfirmation('Hapus Transaksi?', `Anda yakin ingin menghapus transaksi "${description}"?`);
    if (confirmed) {
      deleteTransaction(id);
    }
  };

  const columns = [
    { header: 'Tanggal', accessor: 'date', render: (row) => formatDate(row.date) },
    { header: 'Deskripsi', accessor: 'description' },
    { header: 'Kategori', accessor: 'category' },
    { header: 'Jumlah', accessor: 'amount', render: (row) => <span style={{ color: row.type === 'Pemasukan' ? 'var(--color-success)' : 'var(--color-danger)' }}>{row.type === 'Pengeluaran' ? '-' : '+'} {formatCurrency(row.amount)}</span> },
    { header: 'Aksi', accessor: 'actions', render: (row) => (
      <div className={tableStyles.actionCell}>
        <button className={tableStyles.editButton} onClick={() => setEditingTransaction(row)} title="Edit Transaksi"><FaEdit /></button>
        <button className={tableStyles.deleteButton} onClick={() => handleDelete(row.id, row.description)} title="Hapus Transaksi"><FaTrash /></button>
      </div>
    )},
  ];

  return (
    <div>
      <header style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
        <div><h1 style={{ fontSize: '2rem', fontWeight: '700' }}>Riwayat Transaksi</h1><p style={{ color: 'var(--color-text-secondary)' }}>Kelola semua pemasukan dan pengeluaran Anda.</p></div>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
          <select onChange={(e) => setDateFilter(e.target.value)} value={dateFilter} style={{ padding: '0.65rem', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius-md)'}}>
            <option value="all">Semua Waktu</option><option value="7d">7 Hari Terakhir</option><option value="30d">30 Hari Terakhir</option>
          </select>
          <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Cari deskripsi atau kategori..." />
        </div>
      </header>
      
      {transactions.length > 0 ? (<Table data={filteredTransactions} columns={columns} />) : (<div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--border-radius-md)'}}><EmptyState icon={<FaFileInvoiceDollar />} title="Belum Ada Transaksi" message="Catat transaksi pertamamu dengan menekan tombol 'Tambah Transaksi' di halaman Dashboard." /></div>)}
      <Modal isOpen={!!editingTransaction} onClose={() => setEditingTransaction(null)} title="Edit Transaksi">{editingTransaction && (<TransactionForm onClose={() => setEditingTransaction(null)} transactionToEdit={editingTransaction} />)}</Modal>
    </div>
  );
};

export default TransactionsPage;