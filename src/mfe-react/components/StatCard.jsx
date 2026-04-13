import React, { useState } from 'react';

export default function StatCard({ label, value, change, up }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      className="card"
      style={{ borderColor: hov ? 'var(--react)' : undefined }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{ fontSize: '0.68rem', color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>{label}</div>
      <div style={{ fontSize: '1.7rem', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '0.35rem' }}>{value}</div>
      <div className="mono" style={{ fontSize: '0.68rem', color: up ? 'var(--green)' : '#f85149' }}>
        {up ? '▲' : '▼'} {change}
      </div>
    </div>
  );
}
