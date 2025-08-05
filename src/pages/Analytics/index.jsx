/* src/pages/Analytics/index.jsx */
import React, { useMemo } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import EmptyState from '../../components/ui/EmptyState';
import { FaChartBar } from 'react-icons/fa';

const styles = {
  container: { backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-xl)', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--color-border)' },
  title: { fontSize: '2rem', fontWeight: '700', marginBottom: 'var(--spacing-xl)', color: 'var(--color-text-primary)' },
  chartWrapper: { minHeight: '450px', marginBottom: 'var(--spacing-xl)' },
  chartTitle: { fontSize: '1.5rem', marginBottom: 'var(--spacing-md)', color: 'var(--color-text-secondary)' },
};

const formatCurrency = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
const formatCompact = (value) => new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(value);

const AnalyticsPage = () => {
  const { transactions } = useTransactions();

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
    if (transactions.length === 0) return { data: [], keys: [] };

    const topCategories = {};
    transactions.filter(t => t.type === 'Pengeluaran').forEach(t => {
      topCategories[t.category] = (topCategories[t.category] || 0) + t.amount;
    });
    const top5 = Object.keys(topCategories).sort((a,b) => topCategories[b] - topCategories[a]).slice(0, 5);
    
    const monthlyData = {};
    transactions.filter(t => t.type === 'Pengeluaran' && top5.includes(t.category)).forEach(t => {
      const month = new Date(t.date).toLocaleString('id-ID', { month: 'short', year: 'numeric' });
      if (!monthlyData[month]) {
        monthlyData[month] = { name: month };
        top5.forEach(cat => { monthlyData[month][cat] = 0; });
      }
      monthlyData[month][t.category] = (monthlyData[month][t.category] || 0) + t.amount;
    });

    const sortedData = Object.values(monthlyData).sort((a,b) => new Date(a.name) - new Date(b.name));
    return { data: sortedData, keys: top5 };
  }, [transactions]);

  const COLORS = ['#4cc9f0', '#ff9e43', '#ffb703', '#f72585', '#7209b7'];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Analisis Keuangan</h1>
      {transactions.length > 0 ? (
        <>
          <div style={styles.chartWrapper}>
            <h2 style={styles.chartTitle}>Pemasukan vs Pengeluaran</h2>
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
          <div style={styles.chartWrapper}>
            <h2 style={styles.chartTitle}>Tren Pengeluaran per Kategori</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={categoryTrend.data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--color-text-secondary)' }} />
                <YAxis tick={{ fill: 'var(--color-text-secondary)' }} tickFormatter={formatCompact} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-primary-bg)', border: '1px solid var(--color-border)' }} formatter={formatCurrency} />
                <Legend wrapperStyle={{ color: 'var(--color-text-secondary)' }} />
                {categoryTrend.keys.map((key, i) => (
                  <Line key={key} type="monotone" dataKey={key} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} connectNulls />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <EmptyState icon={<FaChartBar />} title="Analisis Belum Tersedia" message="Data akan muncul di sini setelah Anda menambahkan beberapa transaksi." />
      )}
    </div>
  );
};

export default AnalyticsPage;