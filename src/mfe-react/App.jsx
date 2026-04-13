import React, { useState, useEffect, useCallback } from 'react';
import Counter from './components/Counter';
import StatCard from './components/StatCard';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function App() {
  const [bars, setBars] = useState(MONTHS.map(() => 30 + Math.random() * 70 | 0));
  const [hBar, setHBar] = useState(-1);
  const refresh = useCallback(() => setBars(MONTHS.map(() => 30 + Math.random() * 70 | 0)), []);

  useEffect(() => {
    const unsub = window.__MFE_EVENT_BUS__?.on('shell:refresh', refresh);
    return () => unsub?.();
  }, [refresh]);

  const stats = [
    { label: 'Revenue', value: '$48.2K', change: '+12.5%', up: true },
    { label: 'Users', value: '2,847', change: '+8.3%', up: true },
    { label: 'Latency', value: '42ms', change: '-15%', up: true },
    { label: 'Errors', value: '0.03%', change: '+0.01%', up: false },
  ];

  return (
    <div>
      <div className="badge badge-react">⚛ Rendered by React 18</div>
      <h1 className="pg-title">React Dashboard</h1>
      <p className="pg-sub">
        This page is an independent React 18 app with its own component tree, hooks, and state.
        Webpack code-splits it into a separate chunk loaded on demand.
      </p>

      <div className="g4" style={{ marginBottom: '1.2rem' }}>
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.2rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <span className="card-title">Traffic Overview</span>
            <button onClick={refresh} className="mono" style={{
              background: 'var(--border)', border: 'none', color: 'var(--dim)',
              padding: '0.28rem 0.7rem', borderRadius: '6px', fontSize: '0.62rem', cursor: 'pointer'
            }}>↻ Refresh</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', height: '180px' }}>
            {MONTHS.map((m, i) => (
              <div key={m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', height: '100%', justifyContent: 'flex-end' }}>
                <div
                  style={{
                    width: '100%', maxWidth: '30px', height: `${bars[i]}%`,
                    borderRadius: '4px 4px 0 0', cursor: 'pointer',
                    background: hBar === i ? 'var(--react)' : 'rgba(97,218,251,0.18)',
                    transition: 'height 0.5s ease, background 0.2s',
                  }}
                  onMouseEnter={() => setHBar(i)}
                  onMouseLeave={() => setHBar(-1)}
                />
                <span className="mono" style={{ fontSize: '0.55rem', color: 'var(--dim)' }}>{m}</span>
              </div>
            ))}
          </div>
        </div>
        <Counter />
      </div>
    </div>
  );
}
