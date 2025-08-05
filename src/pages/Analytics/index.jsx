/* src/pages/Analytics/index.jsx */
import React, { useMemo, useState, useEffect } from 'react';
import Select from 'react-select';
import { useTransactions } from '../../context/TransactionContext';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import EmptyState from '../../components/ui/EmptyState';
import { FaChartBar } from 'react-icons/fa';
import styles from './Analytics.module.css';

const formatCurrency = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
const formatCompact = (value) => new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(value);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.customTooltip}>
        <p className={styles.tooltipLabel}>{label}</p>
        {payload.map((pld, index) => (
          <div key={index} style={{ color: pld.color }}>
            {`${pld.name}: ${formatCurrency(pld.value)}`}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const AnalyticsPage = () => {
  const { transactions, categories } = useTransactions();
  const [trendDateRange, setTrendDateRange] = useState('thisYear');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const categoryOptions = categories.map(c => ({ value: c, label: c }));
  const customSelectStyles = {
    control: (provided) => ({...provided, backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'none', '&:hover': { borderColor: 'var(--color-primary-accent)' } }),
    menu: (provided) => ({ ...provided, backgroundColor: 'var(--color-primary-bg)', border: '1px solid var(--color-border)' }),
    menuList: (provided) => ({ ...provided, maxHeight: '200px', overflowY: 'auto' }),
    option: (provided, state) => ({ ...provided, backgroundColor: state.isSelected ? 'var(--color-primary-accent)' : state.isFocused ? 'rgba(76, 201, 240, 0.1)' : 'transparent', color: state.isSelected ? 'var(--color-primary-bg)' : 'var(--color-text-primary)', ':active': { backgroundColor: 'var(--color-primary-accent)' } }),
    multiValue: (provided) => ({ ...provided, backgroundColor: 'var(--color-primary-accent)' }),
    multiValueLabel: (provided) => ({ ...provided, color: 'var(--color-primary-bg)' }),
  };

  const topCategories = useMemo(() => {
    const expenseByCategory = transactions.filter(t => t.type === 'Pengeluaran').reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
    return Object.keys(expenseByCategory).sort((a,b) => expenseByCategory[b] - expenseByCategory[a]).slice(0, 3).map(c => ({ value: c, label: c }));
  }, [transactions]);

  useEffect(() => {
    if (selectedCategories.length === 0 && topCategories.length > 0) {
      setSelectedCategories(topCategories);
    }
  }, [topCategories]);

  const monthlySummary = useMemo(() => {
    if (transactions.length === 0) return [];
    const data = {};
    transactions.forEach(t => {
      const month = new Date(t.date).toLocaleString('id-ID', { month: 'short', year: 'numeric' });
      if (!data[month]) data[month] = { name: month, Pemasukan: 0, Pengeluaran: 0 };
      if (t.type === 'Pemasukan') data[month].Pemasukan += t.amount;
      else data[month].Pengeluaran += t.amount;
    });
    return Object.values(data).sort((a,b) => new Date(a.name) - new Date(b.name));
  }, [transactions]);

  const categoryTrend = useMemo(() => {
    const now = new Date();
    let startDate;
    if (trendDateRange === 'thisYear') startDate = new Date(now.getFullYear(), 0, 1);
    else if (trendDateRange === 'last6Months') startDate = new Date(new Date().setMonth(now.getMonth() - 6));

    const filteredTransactions = transactions.filter(t => {
      if (t.type !== 'Pengeluaran') return false;
      if (startDate && new Date(t.date) < startDate) return false;
      return selectedCategories.some(sc => sc.value === t.category);
    });

    if (filteredTransactions.length === 0) return { data: [], keys: [] };

    const data = {};
    const keys = selectedCategories.map(sc => sc.value);

    filteredTransactions.forEach(t => {
      const month = new Date(t.date).toLocaleString('id-ID', { month: 'short', year: 'numeric' });
      if (!data[month]) {
        data[month] = { name: month };
        keys.forEach(cat => { data[month][cat] = 0; });
      }
      data[month][t.category] = (data[month][t.category] || 0) + t.amount;
    });

    const sortedData = Object.values(data).sort((a,b) => new Date(a.name) - new Date(b.name));
    return { data: sortedData, keys };
  }, [transactions, selectedCategories, trendDateRange]);

  const COLORS = ['#4cc9f0', '#ff9e43', '#ffb703', '#f72585', '#7209b7'];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Analisis Keuangan</h1>
      {transactions.length > 0 ? (
        <>
          <div className={styles.chartWrapper}>
            <h2 className={styles.chartTitle}>Pemasukan vs Pengeluaran</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={monthlySummary} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--color-text-secondary)' }} />
                <YAxis tick={{ fill: 'var(--color-text-secondary)' }} tickFormatter={formatCompact} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-primary-bg)', border: '1px solid var(--color-border)' }} formatter={formatCurrency} cursor={{ fill: 'rgba(76, 201, 240, 0.1)' }} />
                <Legend wrapperStyle={{ color: 'var(--color-text-secondary)' }} />
                <Bar dataKey="Pemasukan" fill="var(--color-success)" />
                <Bar dataKey="Pengeluaran" fill="var(--color-danger)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.chartWrapper}>
            <h2 className={styles.chartTitle}>Tren Pengeluaran per Kategori</h2>
            <div className={styles.filtersContainer}>
              <Select
                isMulti
                options={categoryOptions}
                value={selectedCategories}
                onChange={setSelectedCategories}
                styles={customSelectStyles}
                className={styles.categorySelect}
                placeholder="Pilih Kategori untuk dibandingkan..."
              />
              <div className={styles.dateFilters}>
                <button onClick={() => setTrendDateRange('thisYear')} className={trendDateRange === 'thisYear' ? styles.activeFilter : ''}>Tahun Ini</button>
                <button onClick={() => setTrendDateRange('last6Months')} className={trendDateRange === 'last6Months' ? styles.activeFilter : ''}>6 Bulan Terakhir</button>
                <button onClick={() => setTrendDateRange('allTime')} className={trendDateRange === 'allTime' ? styles.activeFilter : ''}>Semua Waktu</button>
              </div>
            </div>
            {categoryTrend.data.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={categoryTrend.data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="name" tick={{ fill: 'var(--color-text-secondary)' }} />
                  <YAxis tick={{ fill: 'var(--color-text-secondary)' }} tickFormatter={formatCompact} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ color: 'var(--color-text-secondary)' }} />
                  {categoryTrend.keys.map((key, i) => (
                    <Line key={key} type="monotone" dataKey={key} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} connectNulls />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState icon={<FaChartBar />} title="Tidak Ada Data" message="Tidak ada data pengeluaran untuk kategori dan rentang waktu yang dipilih." />
            )}
          </div>
        </>
      ) : (
        <EmptyState icon={<FaChartBar />} title="Analisis Belum Tersedia" message="Data akan muncul di sini setelah Anda menambahkan beberapa transaksi." />
      )}
    </div>
  );
};

export default AnalyticsPage;