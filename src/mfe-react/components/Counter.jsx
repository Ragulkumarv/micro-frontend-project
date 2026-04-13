import React, { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    window.__MFE_SHARED_STORE__?.set('reactCounter', count);
  }, [count]);

  const btnStyle = (primary) => ({
    fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem',
    padding: '0.5rem 1.1rem', borderRadius: '8px', cursor: 'pointer',
    border: '1px solid var(--react)', transition: 'all 0.2s',
    background: primary ? 'var(--react)' : 'transparent',
    color: primary ? 'var(--bg)' : 'var(--react)',
    fontWeight: primary ? 600 : 400,
  });

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card-title">useState Counter</div>
      <div className="card-sub" style={{ textAlign: 'center' }}>React hooks powering state</div>
      <div className="mono" style={{ fontSize: '3.5rem', fontWeight: 700, color: 'var(--react)', textShadow: '0 0 40px rgba(97,218,251,0.12)', padding: '1.5rem 0' }}>
        {count}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button style={btnStyle(false)} onClick={() => setCount(c => c - 1)}>− Dec</button>
        <button style={btnStyle(true)} onClick={() => setCount(c => c + 1)}>+ Inc</button>
        <button style={btnStyle(false)} onClick={() => setCount(0)}>↻ Reset</button>
      </div>
    </div>
  );
}
