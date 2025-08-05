/* src/components/feature/TransactionForm/index.jsx */
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useTransactions } from '../../../context/TransactionContext';
import { formatNumberInput, parseFormattedNumber } from '../../../utils/formatting';
import Button from '../../ui/Button';
import toast from 'react-hot-toast';
import styles from './TransactionForm.module.css';

const getTodayString = () => new Date().toISOString().split('T')[0];

const customSelectStyles = {
    control: (provided) => ({...provided, backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'none', '&:hover': { borderColor: 'var(--color-primary-accent)' },}),
    menu: (provided) => ({ ...provided, backgroundColor: 'var(--color-primary-bg)', border: '1px solid var(--color-border)'}),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    menuList: (provided) => ({ ...provided, maxHeight: '200px', overflowY: 'auto' }),
    option: (provided, state) => ({ ...provided, backgroundColor: state.isSelected ? 'var(--color-primary-accent)' : state.isFocused ? 'rgba(76, 201, 240, 0.1)' : 'transparent', color: state.isSelected ? 'var(--color-primary-bg)' : 'var(--color-text-primary)', ':active': { backgroundColor: 'var(--color-primary-accent)' }, }),
    singleValue: (provided) => ({ ...provided, color: 'var(--color-text-primary)' }),
    input: (provided) => ({ ...provided, color: 'var(--color-text-primary)' }),
};

const TransactionForm = ({ onClose, transactionToEdit }) => {
  const { addTransaction, updateTransaction, categories, accounts } = useTransactions();
  const [type, setType] = useState('Pengeluaran');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(null);
  const [date, setDate] = useState(getTodayString());
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');

  const categoryOptions = categories.map(c => ({ value: c, label: c }));
  const accountOptions = accounts.map(a => ({ value: a.id, label: `${a.name}` }));

  useEffect(() => {
    if (transactionToEdit) {
      setType(transactionToEdit.type);
      setDescription(transactionToEdit.description);
      setAmount(formatNumberInput(transactionToEdit.amount));
      setCategory({ value: transactionToEdit.category, label: transactionToEdit.category });
      setDate(new Date(transactionToEdit.date).toISOString().split('T')[0]);
      setAccountId(transactionToEdit.accountId);
    }
  }, [transactionToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedAmount = parseFormattedNumber(amount);
    if (!description.trim()) { toast.error('Deskripsi tidak boleh kosong.'); return; }
    if (parsedAmount <= 0) { toast.error('Nominal harus lebih besar dari 0.'); return; }
    if (!accountId) { toast.error('Akun harus dipilih.'); return; }
    if (type === 'Pengeluaran' && !category) { toast.error('Kategori harus dipilih untuk pengeluaran.'); return; }
    const transactionData = { type, description, amount: parsedAmount, category: type === 'Pengeluaran' ? category.value : 'Pemasukan', date, accountId };
    if (transactionToEdit) updateTransaction({ ...transactionData, id: transactionToEdit.id });
    else addTransaction(transactionData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}><div className={styles.typeSelector}><button type="button" onClick={() => setType('Pemasukan')} className={`${styles.typeButton} ${styles.income} ${type === 'Pemasukan' ? styles.active : ''}`}>Pemasukan</button><button type="button" onClick={() => setType('Pengeluaran')} className={`${styles.typeButton} ${styles.expense} ${type === 'Pengeluaran' ? styles.active : ''}`}>Pengeluaran</button></div></div>
      <div className={styles.formGroup}><label htmlFor="description" className={styles.label}>Deskripsi</label><input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} className={styles.input} required /></div>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}><label htmlFor="amount" className={styles.label}>Nominal (Rp)</label><input type="text" id="amount" value={amount} onChange={(e) => setAmount(formatNumberInput(e.target.value))} className={styles.input} required inputMode="decimal" /></div>
        <div className={styles.formGroup}><label htmlFor="date" className={styles.label}>Tanggal</label><input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className={styles.input} required /></div>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="account" className={styles.label}>Akun</label>
        <Select id="account" options={accountOptions} value={accountOptions.find(opt => opt.value === accountId)} onChange={opt => setAccountId(opt.value)} styles={customSelectStyles} menuPortalTarget={document.body} menuPosition={'fixed'} />
      </div>
      {type === 'Pengeluaran' && (<div className={styles.formGroup}><label htmlFor="category" className={styles.label}>Kategori</label><Select id="category" options={categoryOptions} value={category} onChange={setCategory} styles={customSelectStyles} placeholder="Pilih atau ketik kategori..." menuPortalTarget={document.body} menuPosition={'fixed'} /></div>)}
      <Button type="submit" variant="primary">{transactionToEdit ? 'Update' : 'Simpan'}</Button>
    </form>
  );
};

export default TransactionForm;