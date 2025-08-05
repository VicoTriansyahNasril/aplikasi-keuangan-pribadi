/* src/context/TransactionContext.jsx */
import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { db } from '../config/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, writeBatch, query, orderBy, getDoc } from 'firebase/firestore';

const TransactionContext = createContext();

const defaultCategories = ['Makanan', 'Transportasi', 'Tagihan', 'Hiburan', 'Lainnya'];
const defaultAccounts = [{ id: 'default', name: 'Dompet Utama', balance: 0 }];

export const TransactionProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [categories, setCategories] = useState(defaultCategories);
  const [goals, setGoals] = useState([]);
  const [recurring, setRecurring] = useState([]);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          
          const transactionsQuery = query(collection(userDocRef, 'transactions'), orderBy('createdAt', 'desc'));
          const accountsQuery = query(collection(userDocRef, 'accounts'));
          const goalsQuery = query(collection(userDocRef, 'goals'));
          const recurringQuery = query(collection(userDocRef, 'recurring'));
          
          const [transactionsSnap, accountsSnap, budgetsSnap, categoriesSnap, goalsSnap, recurringSnap] = await Promise.all([
            getDocs(transactionsQuery), getDocs(accountsQuery),
            getDoc(doc(userDocRef, 'data', 'budgets')), getDoc(doc(userDocRef, 'data', 'categories')),
            getDocs(goalsQuery), getDocs(recurringQuery),
          ]);

          const fetchedTransactions = transactionsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
          let fetchedAccounts = accountsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
          if (fetchedAccounts.length === 0) {
            await setDoc(doc(userDocRef, 'accounts', 'default'), defaultAccounts[0]);
            fetchedAccounts = defaultAccounts;
          }

          setTransactions(fetchedTransactions);
          setAccounts(fetchedAccounts);
          if (budgetsSnap.exists()) setBudgets(budgetsSnap.data()); else setBudgets({});
          if (categoriesSnap.exists()) setCategories(categoriesSnap.data().list); else setCategories(defaultCategories);
          setGoals(goalsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
          setRecurring(recurringSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (error) {
          console.error("Error fetching data:", error);
          toast.error("Gagal memuat data.");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      setTransactions([]); setAccounts([]); setBudgets({}); setCategories(defaultCategories); setGoals([]); setRecurring([]); setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => { document.body.setAttribute('data-theme', theme); localStorage.setItem('theme', theme); }, [theme]);

  const addTransaction = async (transaction, showToast = true) => {
    if (!currentUser) return;
    const newTransaction = { id: uuidv4(), createdAt: new Date().toISOString(), ...transaction };
    const userDocRef = doc(db, 'users', currentUser.uid);
    const trxDocRef = doc(userDocRef, 'transactions', newTransaction.id);
    const accountDocRef = doc(userDocRef, 'accounts', transaction.accountId);
    const accountToUpdate = accounts.find(acc => acc.id === transaction.accountId);
    const newBalance = transaction.type === 'Pemasukan' ? accountToUpdate.balance + transaction.amount : accountToUpdate.balance - transaction.amount;
    const batch = writeBatch(db);
    batch.set(trxDocRef, newTransaction);
    batch.update(accountDocRef, { balance: newBalance });
    await batch.commit();
    setTransactions(prev => [newTransaction, ...prev].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    setAccounts(prev => prev.map(acc => acc.id === transaction.accountId ? { ...acc, balance: newBalance } : acc));
    if (showToast) toast.success('Transaksi berhasil ditambahkan!');
  };

  const updateTransaction = async (updatedTransaction) => {
    if (!currentUser) return;
    const oldTransaction = transactions.find(t => t.id === updatedTransaction.id);
    if (!oldTransaction) return toast.error('Transaksi lama tidak ditemukan untuk diperbarui.');

    const batch = writeBatch(db);
    const userDocRef = doc(db, 'users', currentUser.uid);
    
    const oldAccountRef = doc(userDocRef, 'accounts', oldTransaction.accountId);
    const oldAccount = accounts.find(acc => acc.id === oldTransaction.accountId);
    let revertedOldBalance = oldAccount.balance;
    if (oldTransaction.amount !== updatedTransaction.amount || oldTransaction.type !== updatedTransaction.type || oldTransaction.accountId !== updatedTransaction.accountId) {
        revertedOldBalance = oldTransaction.type === 'Pemasukan' ? oldAccount.balance - oldTransaction.amount : oldAccount.balance + oldTransaction.amount;
        batch.update(oldAccountRef, { balance: revertedOldBalance });
    }

    const newAccountRef = doc(userDocRef, 'accounts', updatedTransaction.accountId);
    const newAccount = accounts.find(acc => acc.id === updatedTransaction.accountId);
    const startingBalance = oldTransaction.accountId === updatedTransaction.accountId ? revertedOldBalance : newAccount.balance;
    const finalNewBalance = updatedTransaction.type === 'Pemasukan' ? startingBalance + updatedTransaction.amount : startingBalance - updatedTransaction.amount;
    batch.update(newAccountRef, { balance: finalNewBalance });
    
    const trxDocRef = doc(userDocRef, 'transactions', updatedTransaction.id);
    const finalTransactionData = { ...oldTransaction, ...updatedTransaction };
    batch.update(trxDocRef, finalTransactionData);
    await batch.commit();

    setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? finalTransactionData : t).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    setAccounts(prev => prev.map(acc => {
      if (acc.id === oldTransaction.accountId && acc.id !== updatedTransaction.accountId) return { ...acc, balance: revertedOldBalance };
      if (acc.id === updatedTransaction.accountId) return { ...acc, balance: finalNewBalance };
      return acc;
    }));
    toast.success('Transaksi berhasil diperbarui!');
  };

  const deleteTransaction = async (id) => {
    if (!currentUser) return;
    const trxToDelete = transactions.find(t => t.id === id);
    if (!trxToDelete) return;
    const userDocRef = doc(db, 'users', currentUser.uid);
    const trxDocRef = doc(userDocRef, 'transactions', id);
    const accountDocRef = doc(userDocRef, 'accounts', trxToDelete.accountId);
    const accountToUpdate = accounts.find(acc => acc.id === trxToDelete.accountId);
    const newBalance = trxToDelete.type === 'Pemasukan' ? accountToUpdate.balance - trxToDelete.amount : accountToUpdate.balance + trxToDelete.amount;
    const batch = writeBatch(db);
    batch.delete(trxDocRef);
    batch.update(accountDocRef, { balance: newBalance });
    await batch.commit();
    setTransactions(prev => prev.filter(t => t.id !== id));
    setAccounts(prev => prev.map(acc => acc.id === trxToDelete.accountId ? { ...acc, balance: newBalance } : acc));
    toast.success('Transaksi berhasil dihapus.');
  };

  const addAccount = async (name, initialBalance) => {
    if (!currentUser) return;
    const newAccount = { id: uuidv4(), name, balance: initialBalance };
    await setDoc(doc(db, 'users', currentUser.uid, 'accounts', newAccount.id), newAccount);
    setAccounts(prev => [...prev, newAccount]);
  };
  
  const deleteAccount = async (id) => {
    if (!currentUser) return;
    await deleteDoc(doc(db, 'users', currentUser.uid, 'accounts', id));
    setAccounts(prev => prev.filter(acc => acc.id !== id));
  };
  
  const setBudgetForCategory = async (category, amount) => {
    if (!currentUser) return;
    const newBudgets = { ...budgets, [category]: amount };
    await setDoc(doc(db, 'users', currentUser.uid, 'data', 'budgets'), newBudgets);
    setBudgets(newBudgets);
  };
  
  const addCategory = async (name) => {
    if (!currentUser || categories.includes(name) || !name) return;
    const newCategories = [...categories, name];
    await setDoc(doc(db, 'users', currentUser.uid, 'data', 'categories'), { list: newCategories });
    setCategories(newCategories);
  };

  const deleteCategory = async (name) => {
    if (!currentUser) return;
    const newCategories = categories.filter(c => c !== name);
    await setDoc(doc(db, 'users', currentUser.uid, 'data', 'categories'), { list: newCategories });
    setCategories(newCategories);
  };
  
  const addGoal = async (name, targetAmount) => {
    if (!currentUser) return;
    const newGoal = { id: uuidv4(), name, targetAmount, currentAmount: 0 };
    await setDoc(doc(db, 'users', currentUser.uid, 'goals', newGoal.id), newGoal);
    setGoals(prev => [...prev, newGoal]);
  };

  const contributeToGoal = async (goalId, amount, fromAccountId) => {
    if (!currentUser) return;
    const goalToUpdate = goals.find(g => g.id === goalId);
    const newCurrentAmount = goalToUpdate.currentAmount + amount;
    await addTransaction({
        type: 'Pengeluaran', description: `Menabung untuk: ${goalToUpdate.name}`, amount,
        category: 'Tujuan Menabung', date: new Date().toISOString().split('T')[0], accountId: fromAccountId
    }, false);
    await setDoc(doc(db, 'users', currentUser.uid, 'goals', goalId), { currentAmount: newCurrentAmount }, { merge: true });
    setGoals(prev => prev.map(g => g.id === goalId ? { ...g, currentAmount: newCurrentAmount } : g));
    toast.success('Berhasil menabung untuk tujuan!');
  };

  const deleteGoal = async (id) => {
    if (!currentUser) return;
    await deleteDoc(doc(db, 'users', currentUser.uid, 'goals', id));
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const addRecurring = async (recurringData) => {
    if (!currentUser) return;
    const newRecurring = { id: uuidv4(), ...recurringData };
    await setDoc(doc(db, 'users', currentUser.uid, 'recurring', newRecurring.id), newRecurring);
    setRecurring(prev => [...prev, newRecurring]);
    toast.success('Template berulang ditambahkan!');
  };

  const deleteRecurring = async (id) => {
    if (!currentUser) return;
    await deleteDoc(doc(db, 'users', currentUser.uid, 'recurring', id));
    setRecurring(prev => prev.filter(r => r.id !== id));
  };

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const income = transactions.filter(t => t.type === 'Pemasukan').reduce((acc, t) => acc + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'Pengeluaran').reduce((acc, t) => acc + t.amount, 0);

  const value = {
    transactions, accounts, totalBalance, income, expense, budgets, categories, theme, loading, goals, recurring,
    addTransaction, updateTransaction, deleteTransaction, addAccount, deleteAccount, setBudgetForCategory,
    addCategory, deleteCategory, addGoal, contributeToGoal, deleteGoal, addRecurring, deleteRecurring, toggleTheme,
  };

  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>;
};

export const useTransactions = () => useContext(TransactionContext);