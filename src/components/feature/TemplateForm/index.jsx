/* src/components/feature/TemplateForm/index.jsx */
import React, { useState } from 'react';
import Select from 'react-select';
import { useTransactions } from '../../../context/TransactionContext';
import { formatNumberInput, parseFormattedNumber } from '../../../utils/formatting';
import Button from '../../ui/Button';
import styles from '../../feature/TransactionForm/TransactionForm.module.css';

const customSelectStyles = {
    control: (provided) => ({...provided, backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'none', '&:hover': { borderColor: 'var(--color-primary-accent)' },}),
    menu: (provided) => ({ ...provided, backgroundColor: 'var(--color-primary-bg)', border: '1px solid var(--color-border)'}),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: '200px',
      overflowY: 'auto',
    }),
    option: (provided, state) => ({ ...provided, backgroundColor: state.isSelected ? 'var(--color-primary-accent)' : state.isFocused ? 'rgba(76, 201, 240, 0.1)' : 'transparent', color: state.isSelected ? 'var(--color-primary-bg)' : 'var(--color-text-primary)', ':active': { backgroundColor: 'var(--color-primary-accent)' }, }),
    singleValue: (provided) => ({ ...provided, color: 'var(--color-text-primary)' }),
    input: (provided) => ({ ...provided, color: 'var(--color-text-primary)' }),
};

const TemplateForm = ({ onClose }) => {
  const { addRecurring, categories, accounts } = useTransactions();
  const [type, setType] = useState('Pengeluaran');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(null);
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [error, setError] = useState('');

  const categoryOptions = categories.map(c => ({ value: c, label: c }));
  const accountOptions = accounts.map(a => ({ value: a.id, label: a.name }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!description.trim() || !amount || !accountId || (type === 'Pengeluaran' && !category)) {
      setError('Semua kolom harus diisi.'); return;
    }
    const templateData = {
      type, description, amount: parseFormattedNumber(amount),
      category: type === 'Pengeluaran' ? category.value : 'Pemasukan',
      accountId
    };
    addRecurring(templateData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}><div className={styles.typeSelector}><button type="button" onClick={() => setType('Pemasukan')} className={`${styles.typeButton} ${styles.income} ${type === 'Pemasukan' ? styles.active : ''}`}>Pemasukan</button><button type="button" onClick={() => setType('Pengeluaran')} className={`${styles.typeButton} ${styles.expense} ${type === 'Pengeluaran' ? styles.active : ''}`}>Pengeluaran</button></div></div>
      <div className={styles.formGroup}><label htmlFor="description" className={styles.label}>Deskripsi</label><input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} className={styles.input} required /></div>
      <div className={styles.formGroup}><label htmlFor="amount" className={styles.label}>Nominal (Rp)</label><input type="text" id="amount" value={amount} onChange={(e) => setAmount(formatNumberInput(e.target.value))} className={styles.input} required inputMode="decimal" /></div>
      <div className={styles.formGroup}>
        <label htmlFor="account" className={styles.label}>Akun</label>
        <Select id="account" options={accountOptions} value={accountOptions.find(opt => opt.value === accountId)} onChange={opt => setAccountId(opt.value)} styles={customSelectStyles} menuPortalTarget={document.body} />
      </div>
      {type === 'Pengeluaran' && (<div className={styles.formGroup}><label htmlFor="category" className={styles.label}>Kategori</label><Select id="category" options={categoryOptions} value={category} onChange={setCategory} styles={customSelectStyles} placeholder="Pilih kategori..." menuPortalTarget={document.body} /></div>)}
      {error && <p className={styles.errorMessage}>{error}</p>}
      <Button type="submit" variant="primary">Simpan Template</Button>
    </form>
  );
};

export default TemplateForm;