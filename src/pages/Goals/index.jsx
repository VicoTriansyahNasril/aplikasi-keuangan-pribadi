/* src/pages/Goals/index.jsx */
import React, { useState } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import Button from '../../components/ui/Button';
import ProgressBar from '../../components/ui/ProgressBar';
import EmptyState from '../../components/ui/EmptyState';
import { formatNumberInput, parseFormattedNumber } from '../../utils/formatting';
import { FaPlus, FaTrash, FaDonate, FaBullseye } from 'react-icons/fa';
import styles from './Goals.module.css';

const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);

const GoalItem = ({ goal }) => {
  const { accounts, contributeToGoal, deleteGoal } = useTransactions();
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');

  const handleContribute = (e) => {
    e.preventDefault();
    const contributionAmount = parseFormattedNumber(amount);
    if (contributionAmount > 0 && accountId) {
      contributeToGoal(goal.id, contributionAmount, accountId);
      setAmount('');
    }
  };

  return (
    <div className={styles.goalItem}>
      <div className={styles.goalHeader}>
        <h3 className={styles.goalName}>{goal.name}</h3>
        <button onClick={() => deleteGoal(goal.id)} className={styles.deleteButton}><FaTrash /></button>
      </div>
      <ProgressBar value={goal.currentAmount} max={goal.targetAmount} />
      <p className={styles.amountInfo}>
        <span className={styles.currentAmount}>{formatCurrency(goal.currentAmount)}</span> / <span className={styles.targetAmount}>{formatCurrency(goal.targetAmount)}</span>
      </p>
      <form onSubmit={handleContribute} className={styles.contributeForm}>
        <input type="text" value={amount} onChange={e => setAmount(formatNumberInput(e.target.value))} placeholder="Jumlah" className={styles.input} />
        <select value={accountId} onChange={e => setAccountId(e.target.value)} className={styles.input}>
          {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
        </select>
        <Button type="submit" icon={<FaDonate />}>Tabung</Button>
      </form>
    </div>
  );
};

const GoalsPage = () => {
  const { goals, addGoal } = useTransactions();
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (name.trim() && parseFormattedNumber(target) > 0) {
      addGoal(name.trim(), parseFormattedNumber(target));
      setName('');
      setTarget('');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tujuan Menabung</h1>
      <p className={styles.subtitle}>Buat target finansial dan lacak progres tabungan Anda di sini.</p>
      <form onSubmit={handleAddGoal} className={styles.addForm}>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nama Tujuan (e.g., Laptop Baru)" className={styles.input} />
        <input type="text" value={target} onChange={e => setTarget(formatNumberInput(e.target.value))} placeholder="Target Nominal" className={styles.input} />
        <Button type="submit" icon={<FaPlus />}>Buat Tujuan</Button>
      </form>
      <div className={styles.goalList}>
        {goals.length > 0 ? (
          goals.map(goal => <GoalItem key={goal.id} goal={goal} />)
        ) : (
          <div className={styles.emptyStateWrapper}>
            <EmptyState 
              icon={<FaBullseye />}
              title="Belum Ada Tujuan"
              message="Buat tujuan menabung pertama Anda untuk mulai melacak progres finansial Anda."
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsPage;