// src/components/ui/SearchInput/index.jsx
import React from 'react';
import { FaSearch } from 'react-icons/fa';
import styles from './SearchInput.module.css';

const SearchInput = ({ value, onChange, placeholder }) => {
  return (
    <div className={styles.wrapper}>
      <FaSearch className={styles.icon} />
      <input
        type="text"
        className={styles.input}
        value={value}
        onChange={onChange}
        placeholder={placeholder || 'Cari...'}
      />
    </div>
  );
};

export default SearchInput;