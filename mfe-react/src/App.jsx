import React, { useState, useEffect, useCallback } from 'react';
import Counter from './components/Counter';
import StatCard from './components/StatCard';

const styles = {
  container: {
    fontFamily: "'Sora', sans-serif",
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.65rem',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    padding: '0.35rem 0.9rem',
    borderRadius: '20px',
    border: '1px solid #61dafb',
    color: '#61dafb',
    background: 'rgba(97, 218, 251, 0.08)',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    letterSpacing: '-0.03em',
    marginBottom: '0.5rem',
    color: '#e4e4ef',
  },
  subtitle: {
    fontSize: '0.9rem',
    color: '#6b6b80',
    marginBottom: '2rem',
    fontWeight: 300,
    lineHeight: 1.6,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  chartCard: {
    background: '#12121a',
    border: '1px solid #2a2a3a',
    borderRadius: '10px',
    padding: '1.5rem',
  },
  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  chartTitle: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#e4e4ef',
  },
  barsContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '6px',
    height: '180px',
  },
  barCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.6rem',
    color: '#6b6b80',
  },
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function App() {
  const [stats] = useState([
    { label: 'Revenue', value: '$48.2K', change: '+12.5%', direction: 'up' },
    { label: 'Users', value: '2,847', change: '+8.3%', direction: 'up' },
    { label: 'Latency', value: '42ms', change: '-15%', direction: 'up' },
    { label: 'Errors', value: '0.03%', change: '+0.01%', direction: 'down' },
  ]);

  const [chartData, setChartData] = useState(
    MONTHS.map(() => Math.floor(30 + Math.random() * 70))
  );

  const refreshChart = useCallback(() => {
    setChartData(MONTHS.map(() => Math.floor(30 + Math.random() * 70)));
  }, []);

  // Listen for refresh events from other MFEs or the shell
  useEffect(() => {
    if (window.__MFE_EVENT_BUS__) {
      const unsub = window.__MFE_EVENT_BUS__.on('shell:refresh', refreshChart);
      return unsub;
    }
  }, [refreshChart]);

  return (
    <div style={styles.container}>
      <div style={styles.badge}>⚛ Rendered by React 18</div>
      <h1 style={styles.title}>React Dashboard</h1>
      <p style={styles.subtitle}>
        This entire page is a standalone React 18 application loaded via Module
        Federation. It has its own package.json, build pipeline, and can be
        deployed independently.
      </p>

      {/* Stats row */}
      <div style={styles.grid}>
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Chart + Counter side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <span style={styles.chartTitle}>Traffic Overview</span>
            <button
              onClick={refreshChart}
              style={{
                background: '#2a2a3a',
                border: 'none',
                color: '#6b6b80',
                padding: '0.3rem 0.8rem',
                borderRadius: '6px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.65rem',
                cursor: 'pointer',
              }}
            >
              ↻ Refresh
            </button>
          </div>
          <div style={styles.barsContainer}>
            {MONTHS.map((month, i) => (
              <div key={month} style={styles.barCol}>
                <div
                  style={{
                    width: '100%',
                    maxWidth: '32px',
                    height: `${chartData[i]}%`,
                    borderRadius: '4px 4px 0 0',
                    background: 'rgba(97, 218, 251, 0.2)',
                    transition: 'height 0.5s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#61dafb';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(97, 218, 251, 0.2)';
                  }}
                />
                <span style={styles.barLabel}>{month}</span>
              </div>
            ))}
          </div>
        </div>

        <Counter />
      </div>
    </div>
  );
}
