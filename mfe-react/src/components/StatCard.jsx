import React from 'react';

const styles = {
  card: {
    background: '#12121a',
    border: '1px solid #2a2a3a',
    borderRadius: '10px',
    padding: '1.3rem',
    transition: 'border-color 0.3s',
    cursor: 'default',
  },
  label: {
    fontSize: '0.72rem',
    color: '#6b6b80',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '0.6rem',
  },
  value: {
    fontSize: '1.8rem',
    fontWeight: 700,
    letterSpacing: '-0.03em',
    lineHeight: 1,
    marginBottom: '0.4rem',
    color: '#e4e4ef',
  },
  changeUp: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.7rem',
    color: '#3fb950',
  },
  changeDown: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.7rem',
    color: '#f85149',
  },
};

export default function StatCard({ label, value, change, direction }) {
  return (
    <div
      style={styles.card}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#61dafb';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#2a2a3a';
      }}
    >
      <div style={styles.label}>{label}</div>
      <div style={styles.value}>{value}</div>
      <div style={direction === 'up' ? styles.changeUp : styles.changeDown}>
        {direction === 'up' ? '▲' : '▼'} {change}
      </div>
    </div>
  );
}
