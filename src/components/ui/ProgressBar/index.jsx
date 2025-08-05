/* src/components/ui/ProgressBar/index.jsx */
import React from 'react';
import styles from './ProgressBar.module.css';

const ProgressBar = ({ value, max }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  const safePercentage = Math.min(100, Math.max(0, percentage));

  let barColor = 'var(--color-success)';
  if (safePercentage > 75) barColor = 'var(--color-warning)';
  if (safePercentage >= 100) barColor = 'var(--color-danger)';

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.bar}
        style={{ width: `${safePercentage}%`, backgroundColor: barColor }}
      ></div>
    </div>
  );
};

export default ProgressBar;