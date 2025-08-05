// src/components/ui/Table/index.jsx
import React from 'react';
import styles from './Table.module.css';

const Table = ({ data, columns }) => {
  if (!data || data.length === 0) {
    return <p style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>Tidak ada data untuk ditampilkan.</p>;
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.accessor}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col) => (
                <td key={col.accessor}>
                  {/* Jika ada fungsi render khusus, gunakan itu. Jika tidak, tampilkan data biasa. */}
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;