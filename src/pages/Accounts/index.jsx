/* src/pages/Accounts/index.jsx */
import React, { useState } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import Button from '../../components/ui/Button';
import { formatNumberInput, parseFormattedNumber } from '../../utils/formatting';
import { showConfirmation } from '../../utils/confirmation';
import { FaPlus, FaTrash } from 'react-icons/fa';
import styles from './Accounts.module.css';

const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);

const AccountsPage = () => {
  const { accounts, addAccount, deleteAccount } = useTransactions();
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');

  const handleAddAccount = () => {
    if (name.trim()) {
      addAccount(name.trim(), parseFormattedNumber(balance) || 0);
      setName('');
      setBalance('');
    }
  };

  const handleDeleteAccount = async (id, name) => {
    const confirmed = await showConfirmation({
        title: 'Hapus Akun?',
        text: `Menghapus akun "${name}" tidak akan menghapus riwayat transaksinya. Anda yakin?`,
        confirmButtonText: 'Ya, hapus!'
    });
    if (confirmed) {
        deleteAccount(id);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Kelola Akun/Dompet</h1>
      <p className={styles.subtitle}>Buat "dompet" virtual untuk mencerminkan sumber dana Anda di dunia nyata, seperti rekening bank, dompet digital, atau uang tunai.</p>
      <div className={styles.addForm}>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nama Akun (e.g., BCA)" className={styles.input} />
        <input type="text" value={balance} onChange={e => setBalance(formatNumberInput(e.target.value))} placeholder="Saldo Awal (Opsional)" className={styles.input} inputMode="decimal" />
        <Button onClick={handleAddAccount} icon={<FaPlus />}>Tambah Akun</Button>
      </div>
      <div className={styles.accountList}>
        {accounts.map(acc => (
          <div key={acc.id} className={styles.accountItem}>
            <div><p className={styles.accountName}>{acc.name}</p><p className={styles.accountBalance}>{formatCurrency(acc.balance)}</p></div>
            {accounts.length > 1 && (
              <button onClick={() => handleDeleteAccount(acc.id, acc.name)} className={styles.deleteButton} title="Hapus Akun"><FaTrash /></button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default AccountsPage;