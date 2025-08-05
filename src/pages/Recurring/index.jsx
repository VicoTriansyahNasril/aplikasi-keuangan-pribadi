/* src/pages/Recurring/index.jsx */
import React, { useState } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import TemplateForm from '../../components/feature/TemplateForm'; // Kita akan buat komponen baru ini
import EmptyState from '../../components/ui/EmptyState';
import { FaTrash, FaPlus, FaRedo } from 'react-icons/fa';
import styles from './Recurring.module.css';

const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);

const RecurringPage = () => {
  const { recurring, deleteRecurring, addTransaction, accounts } = useTransactions();
  const [isModalOpen, setModalOpen] = useState(false);

  const handleUseTemplate = (template) => {
    const accountExists = accounts.some(acc => acc.id === template.accountId);
    if (!accountExists) {
      alert(`Akun yang terkait dengan template ini tidak ditemukan. Transaksi akan ditambahkan ke akun default.`);
      addTransaction({ ...template, accountId: accounts[0]?.id, date: new Date().toISOString().split('T')[0] });
      return;
    }
    addTransaction({ ...template, date: new Date().toISOString().split('T')[0] });
  };
  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Template Transaksi</h1>
          <p className={styles.subtitle}>Gunakan template ini untuk mencatat transaksi rutin dengan cepat. Transaksi akan dibuat dengan tanggal hari ini.</p>
        </div>
        <Button onClick={() => setModalOpen(true)} icon={<FaPlus />}>Buat Template Baru</Button>
      </header>

      {recurring.length > 0 ? (
        <div className={styles.recurringList}>
          {recurring.map(item => (
            <div key={item.id} className={styles.recurringItem}>
              <div className={styles.itemHeader}>
                <div className={styles.itemInfo}>
                  <p>{item.description}</p>
                  <span>{item.category}</span>
                </div>
                <button onClick={() => deleteRecurring(item.id)} className={styles.deleteButton}><FaTrash /></button>
              </div>
              <p className={`${styles.itemAmount} ${item.type === 'Pemasukan' ? styles.income : styles.expense}`}>
                {formatCurrency(item.amount)}
              </p>
              <div className={styles.itemFooter}>
                <Button onClick={() => handleUseTemplate(item)} icon={<FaRedo />}>Gunakan</Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={<FaRedo />}
          title="Belum Ada Template"
          message="Buat template untuk transaksi yang sering Anda lakukan, seperti membayar tagihan atau menerima gaji."
        />
      )}
      
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Buat Template Baru">
        <TemplateForm onClose={() => setModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default RecurringPage;