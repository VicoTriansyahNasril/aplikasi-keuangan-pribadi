/* src/components/ui/ToggleSwitch/index.jsx */
import React from 'react';
import styles from './ToggleSwitch.module.css';

const ToggleSwitch = ({ checked, onChange }) => {
  return (
    <label className={styles.switch}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className={styles.slider}></span>
    </label>
  );
};

export default ToggleSwitch;