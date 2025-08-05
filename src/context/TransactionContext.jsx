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
          
          const [transactionsSnap, accountsSnap, budgetsSnap, categoriesSnap] = await Promise.all([
            getDocs(transactionsQuery),
            getDocs(accountsQuery),
            getDoc(doc(userDocRef, 'data', 'budgets')),
            getDoc(doc(userDocRef, 'data', 'categories')),
          ]);

          const fetchedTransactions = transactionsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
          let fetchedAccounts = accountsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

          if (fetchedAccounts.length === 0) {
            await setDoc(doc(userDocRef, 'accounts', 'default'), defaultAccounts[0]);
            fetchedAccounts = defaultAccounts;
          }

          setTransactions(fetchedTransactions);
          setAccounts(fetchedAccounts);
          if (budgetsSnap.exists()) setBudgets(budgetsSnap.data());
          if (categoriesSnap.exists()) setCategories(categoriesSnap.data().list);

        } catch (error) {
          console.error("Error fetching data:", error);
          toast.error("Gagal memuat data.");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      setTransactions([]);
      setAccounts([]);
      setBudgets({});
      setCategories(defaultCategories);
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const addTransaction = async (transaction) => {
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

    setTransactions(prev => [newTransaction, ...prev]);
    setAccounts(prev => prev.map(acc => acc.id === transaction.accountId ? { ...acc, balance: newBalance } : acc));
    toast.success('Transaksi berhasil ditambahkan!');
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

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const income = transactions.filter(t => t.type === 'Pemasukan').reduce((acc, t) => acc + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'Pengeluaran').reduce((acc, t) => acc + t.amount, 0);

  const value = {
    transactions, accounts, totalBalance, income, expense, budgets, categories, theme, loading,
    addTransaction, deleteTransaction, addAccount, deleteAccount, setBudgetForCategory, addCategory, deleteCategory, toggleTheme,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  return useContext(TransactionContext);
};