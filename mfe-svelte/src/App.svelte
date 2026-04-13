<script>
  import { ballX, ballY, ballSize, ballHue, clickCount, ballColor, ballShadow, ballArea } from './stores.js';
  import MotionBox from './components/MotionBox.svelte';
  import StoreDisplay from './components/StoreDisplay.svelte';

  let areaValue;
  let colorValue;

  ballArea.subscribe((v) => (areaValue = v));
  ballColor.subscribe((v) => (colorValue = v));

  function handleSizeChange(e) {
    ballSize.set(Number(e.target.value));
  }

  function handleHueChange(e) {
    ballHue.set(Number(e.target.value));
  }
</script>

<div class="svelte-app">
  <div class="fw-badge">🔥 Rendered by Svelte</div>
  <h1 class="page-title">Svelte Motion Lab</h1>
  <p class="page-sub">
    Built with Svelte's reactive stores (writable, derived) and compiled
    reactivity. Svelte compiles to minimal vanilla JS — no virtual DOM overhead.
  </p>

  <div class="grid-2">
    <div class="card">
      <h3 class="card-title">Reactive Motion</h3>
      <p class="card-sub">Click anywhere to move — stores update, UI reacts</p>

      <MotionBox />

      <div class="slider-row">
        <span class="slider-label">Size</span>
        <input
          type="range"
          class="slider"
          min="20"
          max="120"
          value={$ballSize}
          on:input={handleSizeChange}
        />
        <span class="slider-val">{$ballSize}px</span>
      </div>

      <div class="slider-row">
        <span class="slider-label">Hue</span>
        <input
          type="range"
          class="slider"
          min="0"
          max="360"
          value={$ballHue}
          on:input={handleHueChange}
        />
        <span class="slider-val">{$ballHue}°</span>
      </div>
    </div>

    <div class="card">
      <h3 class="card-title">Store Values</h3>
      <p class="card-sub">Live derived & writable store state</p>

      <StoreDisplay />

      <div class="computed-area">
        <div class="computed-label">Derived: computed area</div>
        <div class="computed-value" style="color: {colorValue}; text-shadow: 0 0 30px {colorValue}40">
          {areaValue}
        </div>
        <div class="computed-label">π × r² (auto-updates)</div>
      </div>
    </div>
  </div>
</div>

<style>
  .svelte-app {
    font-family: 'Sora', sans-serif;
  }

  .fw-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 0.35rem 0.9rem;
    border-radius: 20px;
    border: 1px solid #ff3e00;
    color: #ff3e00;
    background: rgba(255, 62, 0, 0.08);
    margin-bottom: 1.5rem;
  }

  .page-title {
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: -0.03em;
    margin-bottom: 0.5rem;
    color: #e4e4ef;
  }

  .page-sub {
    font-size: 0.9rem;
    color: #6b6b80;
    margin-bottom: 2rem;
    font-weight: 300;
    line-height: 1.6;
  }

  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.2rem;
  }

  .card {
    background: #12121a;
    border: 1px solid #2a2a3a;
    border-radius: 10px;
    padding: 1.5rem;
  }

  .card-title {
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 0.3rem;
    color: #e4e4ef;
  }

  .card-sub {
    font-size: 0.72rem;
    color: #6b6b80;
    margin-bottom: 1rem;
  }

  .slider-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
  }

  .slider-label {
    font-size: 0.72rem;
    color: #6b6b80;
    min-width: 32px;
  }

  .slider {
    flex: 1;
    -webkit-appearance: none;
    height: 4px;
    background: #2a2a3a;
    border-radius: 2px;
    outline: none;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #ff3e00;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(255, 62, 0, 0.3);
  }

  .slider-val {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    color: #ff3e00;
    min-width: 40px;
    text-align: right;
  }

  .computed-area {
    text-align: center;
    padding: 1.5rem 0 0.5rem;
  }

  .computed-label {
    font-size: 0.72rem;
    color: #6b6b80;
  }

  .computed-value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 2.2rem;
    font-weight: 700;
    margin: 0.5rem 0;
  }

  @media (max-width: 768px) {
    .grid-2 {
      grid-template-columns: 1fr;
    }
    .page-title {
      font-size: 1.5rem;
    }
  }
</style>
