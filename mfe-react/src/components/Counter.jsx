import React, { useState, useEffect } from 'react';

const styles = {
  card: {
    background: '#12121a',
    border: '1px solid #2a2a3a',
    borderRadius: '10px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: '0.9rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
    color: '#e4e4ef',
  },
  subtitle: {
    fontSize: '0.72rem',
    color: '#6b6b80',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  display: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '4rem',
    fontWeight: 700,
    color: '#61dafb',
    textShadow: '0 0 40px rgba(97, 218, 251, 0.15)',
    lineHeight: 1,
    marginBottom: '1.5rem',
  },
  btnRow: {
    display: 'flex',
    gap: '0.5rem',
  },
  btn: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.75rem',
    padding: '0.55rem 1.1rem',
    borderRadius: '8px',
    border: '1px solid #61dafb',
    background: 'transparent',
    color: '#61dafb',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  btnPrimary: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.75rem',
    padding: '0.55rem 1.1rem',
    borderRadius: '8px',
    border: '1px solid #61dafb',
    background: '#61dafb',
    color: '#0a0a0f',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontWeight: 600,
  },
};

export default function Counter() {
  const [count, setCount] = useState(0);

  // Sync counter to shared store
  useEffect(() => {
    if (window.__MFE_SHARED_STORE__) {
      window.__MFE_SHARED_STORE__.set('reactCounter', count);
    }
  }, [count]);

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>useState Counter</h3>
      <p style={styles.subtitle}>Powered by React hooks</p>
      <div style={styles.display}>{count}</div>
      <div style={styles.btnRow}>
        <button style={styles.btn} onClick={() => setCount((c) => c - 1)}>
          − Dec
        </button>
        <button style={styles.btnPrimary} onClick={() => setCount((c) => c + 1)}>
          + Inc
        </button>
        <button style={styles.btn} onClick={() => setCount(0)}>
          ↻ Reset
        </button>
      </div>
    </div>
  );
}
