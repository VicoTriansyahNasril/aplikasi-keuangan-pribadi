/* src/context/TransactionContext.jsx */
import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { db, useFirebase } from '../config/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, writeBatch, query, orderBy, getDoc } from 'firebase/firestore';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const TransactionContext = createContext();

const defaultCategories = ['Makanan', 'Transportasi', 'Tagihan', 'Hiburan', 'Lainnya'];
const defaultAccounts = [{ id: 'default', name: 'Dompet Utama', balance: 0 }];
const LOCAL_DATA_KEY = 'financeapp_local_data';

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

  const getLocalData = () => {
    const data = localStorage.getItem(LOCAL_DATA_KEY);
    return data ? JSON.parse(data) : {
      transactions: [], accounts: defaultAccounts, budgets: {},
      categories: defaultCategories, goals: [], recurring: []
    };
  };

  const setLocalData = (data) => {
    localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(data));
  };

  useEffect(() => {
    if (currentUser) {
      const fetchData = async () => {
        setLoading(true);
        if (useFirebase) {
          try {
            const userDocRef = doc(db, 'users', currentUser.uid);
            const transactionsQuery = query(collection(userDocRef, 'transactions'), orderBy('createdAt', 'desc'));
            const accountsQuery = query(collection(userDocRef, 'accounts'));
            const goalsQuery = query(collection(userDocRef, 'goals'));
            const recurringQuery = query(collection(userDocRef, 'recurring'));
            
            const [transSnap, accSnap, budSnap, catSnap, goalSnap, recSnap] = await Promise.all([
              getDocs(transactionsQuery), getDocs(accountsQuery),
              getDoc(doc(userDocRef, 'data', 'budgets')), getDoc(doc(userDocRef, 'data', 'categories')),
              getDocs(goalsQuery), getDocs(recurringQuery),
            ]);

            let fetchedAccounts = accSnap.docs.map(d => ({ id: d.id, ...d.data() }));
            if (fetchedAccounts.length === 0) {
              await setDoc(doc(userDocRef, 'accounts', 'default'), defaultAccounts[0]);
              fetchedAccounts = defaultAccounts;
            }

            setTransactions(transSnap.docs.map(d => ({ id: d.id, ...d.data() })));
            setAccounts(fetchedAccounts);
            setBudgets(budSnap.exists() ? budSnap.data() : {});
            setCategories(catSnap.exists() ? catSnap.data().list : defaultCategories);
            setGoals(goalSnap.docs.map(d => ({ id: d.id, ...d.data() })));
            setRecurring(recSnap.docs.map(d => ({ id: d.id, ...d.data() })));
          } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Gagal memuat data.");
          }
        } else {
          const localData = getLocalData();
          setTransactions(localData.transactions);
          setAccounts(localData.accounts);
          setBudgets(localData.budgets);
          setCategories(localData.categories);
          setGoals(localData.goals);
          setRecurring(localData.recurring);
        }
        setLoading(false);
      };
      fetchData();
    } else {
      setLoading(false);
      setTransactions([]);
      setAccounts([]);
      setBudgets({});
      setCategories(defaultCategories);
      setGoals([]);
      setRecurring([]);
    }
  }, [currentUser]);
  
  useEffect(() => {
    if (!useFirebase && !loading) {
      setLocalData({ transactions, accounts, budgets, categories, goals, recurring });
    }
  }, [transactions, accounts, budgets, categories, goals, recurring, loading]);

  useEffect(() => { document.body.setAttribute('data-theme', theme); localStorage.setItem('theme', theme); }, [theme]);
  
  const addTransaction = async (transaction, showToast = true) => {
    if (!currentUser) return;
    const newTransaction = { id: uuidv4(), createdAt: new Date().toISOString(), ...transaction };
    const accountToUpdate = accounts.find(acc => acc.id === transaction.accountId);
    const newBalance = transaction.type === 'Pemasukan' ? accountToUpdate.balance + transaction.amount : accountToUpdate.balance - transaction.amount;

    if (useFirebase) {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const trxDocRef = doc(userDocRef, 'transactions', newTransaction.id);
      const accountDocRef = doc(userDocRef, 'accounts', transaction.accountId);
      const batch = writeBatch(db);
      batch.set(trxDocRef, newTransaction);
      batch.update(accountDocRef, { balance: newBalance });
      await batch.commit();
    }

    setTransactions(prev => [newTransaction, ...prev].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    setAccounts(prev => prev.map(acc => acc.id === transaction.accountId ? { ...acc, balance: newBalance } : acc));
    if (showToast) toast.success('Transaksi berhasil ditambahkan!');
  };

  const updateTransaction = async (updatedTransaction) => {
    if (!currentUser) return;
    const oldTransaction = transactions.find(t => t.id === updatedTransaction.id);
    if (!oldTransaction) return toast.error('Transaksi lama tidak ditemukan untuk diperbarui.');
    
    let revertedOldBalance;
    let finalNewBalance;
    const oldAccount = accounts.find(acc => acc.id === oldTransaction.accountId);
    const newAccount = accounts.find(acc => acc.id === updatedTransaction.accountId);

    if (oldTransaction.accountId === updatedTransaction.accountId) {
      const balanceChange = (updatedTransaction.type === 'Pemasukan' ? updatedTransaction.amount : -updatedTransaction.amount) - (oldTransaction.type === 'Pemasukan' ? oldTransaction.amount : -oldTransaction.amount);
      finalNewBalance = oldAccount.balance + balanceChange;
    } else {
      revertedOldBalance = oldTransaction.type === 'Pemasukan' ? oldAccount.balance - oldTransaction.amount : oldAccount.balance + oldTransaction.amount;
      finalNewBalance = updatedTransaction.type === 'Pemasukan' ? newAccount.balance + updatedTransaction.amount : newAccount.balance - updatedTransaction.amount;
    }

    if (useFirebase) {
      const batch = writeBatch(db);
      const userDocRef = doc(db, 'users', currentUser.uid);
      const trxDocRef = doc(userDocRef, 'transactions', updatedTransaction.id);
      if (oldTransaction.accountId !== updatedTransaction.accountId) {
        batch.update(doc(userDocRef, 'accounts', oldTransaction.accountId), { balance: revertedOldBalance });
      }
      batch.update(doc(userDocRef, 'accounts', updatedTransaction.accountId), { balance: finalNewBalance });
      batch.update(trxDocRef, { ...oldTransaction, ...updatedTransaction });
      await batch.commit();
    }
    
    setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? { ...oldTransaction, ...updatedTransaction } : t).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    setAccounts(prev => {
        const newAccounts = [...prev];
        const oldAccIndex = newAccounts.findIndex(a => a.id === oldTransaction.accountId);
        const newAccIndex = newAccounts.findIndex(a => a.id === updatedTransaction.accountId);
        if (oldTransaction.accountId === updatedTransaction.accountId) {
            if (oldAccIndex > -1) newAccounts[oldAccIndex] = { ...newAccounts[oldAccIndex], balance: finalNewBalance };
        } else {
            if (oldAccIndex > -1) newAccounts[oldAccIndex] = { ...newAccounts[oldAccIndex], balance: revertedOldBalance };
            if (newAccIndex > -1) newAccounts[newAccIndex] = { ...newAccounts[newAccIndex], balance: finalNewBalance };
        }
        return newAccounts;
    });
    toast.success('Transaksi berhasil diperbarui!');
  };

  const deleteTransaction = async (id) => {
    if (!currentUser) return;
    const trxToDelete = transactions.find(t => t.id === id);
    if (!trxToDelete) return;
    const accountToUpdate = accounts.find(acc => acc.id === trxToDelete.accountId);
    const newBalance = trxToDelete.type === 'Pemasukan' ? accountToUpdate.balance - trxToDelete.amount : accountToUpdate.balance + trxToDelete.amount;

    if (useFirebase) {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const trxDocRef = doc(userDocRef, 'transactions', id);
      const accountDocRef = doc(userDocRef, 'accounts', trxToDelete.accountId);
      const batch = writeBatch(db);
      batch.delete(trxDocRef);
      batch.update(accountDocRef, { balance: newBalance });
      await batch.commit();
    }
    
    setTransactions(prev => prev.filter(t => t.id !== id));
    setAccounts(prev => prev.map(acc => acc.id === trxToDelete.accountId ? { ...acc, balance: newBalance } : acc));
    toast.success('Transaksi berhasil dihapus.');
  };

  const addAccount = async (name, initialBalance) => { if (!currentUser) return; const newAccount = { id: uuidv4(), name, balance: initialBalance }; if (useFirebase) { await setDoc(doc(db, 'users', currentUser.uid, 'accounts', newAccount.id), newAccount); } setAccounts(prev => [...prev, newAccount]); };
  const deleteAccount = async (id) => { if (!currentUser) return; if (useFirebase) { await deleteDoc(doc(db, 'users', currentUser.uid, 'accounts', id)); } setAccounts(prev => prev.filter(acc => acc.id !== id)); };
  const setBudgetForCategory = async (category, amount) => { if (!currentUser) return; const newBudgets = { ...budgets, [category]: amount }; if (useFirebase) { await setDoc(doc(db, 'users', currentUser.uid, 'data', 'budgets'), newBudgets); } setBudgets(newBudgets); };
  const addCategory = async (name) => { if (!currentUser || categories.includes(name) || !name) return; const newCategories = [...categories, name]; if (useFirebase) { await setDoc(doc(db, 'users', currentUser.uid, 'data', 'categories'), { list: newCategories }); } setCategories(newCategories); };
  const deleteCategory = async (name) => { if (!currentUser) return; const newCategories = categories.filter(c => c !== name); if (useFirebase) { await setDoc(doc(db, 'users', currentUser.uid, 'data', 'categories'), { list: newCategories }); } setCategories(newCategories); };
  const addGoal = async (name, targetAmount) => { if (!currentUser) return; const newGoal = { id: uuidv4(), name, targetAmount, currentAmount: 0 }; if (useFirebase) { await setDoc(doc(db, 'users', currentUser.uid, 'goals', newGoal.id), newGoal); } setGoals(prev => [...prev, newGoal]); };
  const contributeToGoal = async (goalId, amount, fromAccountId) => { if (!currentUser) return; const goalToUpdate = goals.find(g => g.id === goalId); const newCurrentAmount = goalToUpdate.currentAmount + amount; await addTransaction({ type: 'Pengeluaran', description: `Menabung untuk: ${goalToUpdate.name}`, amount, category: 'Tujuan Menabung', date: new Date().toISOString().split('T')[0], accountId: fromAccountId }, false); if (useFirebase) { await setDoc(doc(db, 'users', currentUser.uid, 'goals', goalId), { currentAmount: newCurrentAmount }, { merge: true }); } setGoals(prev => prev.map(g => g.id === goalId ? { ...g, currentAmount: newCurrentAmount } : g)); toast.success('Berhasil menabung untuk tujuan!'); };
  const deleteGoal = async (id) => { if (!currentUser) return; if (useFirebase) { await deleteDoc(doc(db, 'users', currentUser.uid, 'goals', id)); } setGoals(prev => prev.filter(g => g.id !== id)); };
  const addRecurring = async (recurringData) => { if (!currentUser) return; const newRecurring = { id: uuidv4(), ...recurringData }; if (useFirebase) { await setDoc(doc(db, 'users', currentUser.uid, 'recurring', newRecurring.id), newRecurring); } setRecurring(prev => [...prev, newRecurring]); toast.success('Template berulang ditambahkan!'); };
  const deleteRecurring = async (id) => { if (!currentUser) return; if (useFirebase) { await deleteDoc(doc(db, 'users', currentUser.uid, 'recurring', id)); } setRecurring(prev => prev.filter(r => r.id !== id)); };
  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const income = transactions.filter(t => t.type === 'Pemasukan').reduce((acc, t) => acc + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'Pengeluaran').reduce((acc, t) => acc + t.amount, 0);

  const value = {
    transactions, accounts, totalBalance, income, expense, budgets, categories, theme, loading, goals, recurring,
    addTransaction, updateTransaction, deleteTransaction, addAccount, deleteAccount, setBudgetForCategory,
    addCategory, deleteCategory, addGoal, contributeToGoal, deleteGoal, addRecurring, deleteRecurring, toggleTheme,
  };

  if (loading && !currentUser) {
    return <LoadingSpinner />;
  }

  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>;
};

export const useTransactions = () => useContext(TransactionContext);