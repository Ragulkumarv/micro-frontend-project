<script>
  import { ballX, ballY, ballSize, ballHue, clickCount, ballColor, ballShadow, ballArea } from './stores.js';
  import MotionBox from './components/MotionBox.svelte';
  import StoreDisplay from './components/StoreDisplay.svelte';

  function handleSizeChange(e) { ballSize.set(Number(e.target.value)); }
  function handleHueChange(e) { ballHue.set(Number(e.target.value)); }
</script>

<div>
  <div class="badge badge-svelte">🔥 Rendered by Svelte</div>
  <h1 class="pg-title">Svelte Motion Lab</h1>
  <p class="pg-sub">Built with Svelte's reactive stores (writable, derived) and compiled into minimal vanilla JS by svelte-loader. No virtual DOM overhead.</p>
  <div class="g2">
    <div class="card">
      <div class="card-title">Reactive Motion</div>
      <div class="card-sub">Click to move · Sliders update stores · UI reacts instantly</div>
      <MotionBox />
      <div class="slider-row">
        <span class="slider-label">Size</span>
        <input type="range" class="slider" min="20" max="120" value={$ballSize} on:input={handleSizeChange} />
        <span class="slider-val">{$ballSize}px</span>
      </div>
      <div class="slider-row">
        <span class="slider-label">Hue</span>
        <input type="range" class="slider" min="0" max="360" value={$ballHue} on:input={handleHueChange} />
        <span class="slider-val">{$ballHue}°</span>
      </div>
    </div>
    <div class="card">
      <div class="card-title">Store Values</div>
      <div class="card-sub">Live writable & derived store state</div>
      <StoreDisplay />
      <div class="computed-area">
        <div class="computed-label">Derived: computed area</div>
        <div class="computed-value" style="color:{$ballColor};text-shadow:0 0 30px {$ballColor}40">{$ballArea}</div>
        <div class="computed-label">π × r² (auto-updates)</div>
      </div>
    </div>
  </div>
</div>

<style>
  .slider-row{display:flex;align-items:center;gap:1rem;margin-top:1rem}
  .slider-label{font-size:0.7rem;color:var(--dim);min-width:28px}
  .slider{flex:1;-webkit-appearance:none;height:4px;background:var(--border);border-radius:2px;outline:none}
  .slider::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:#ff3e00;cursor:pointer;box-shadow:0 0 10px rgba(255,62,0,0.3)}
  .slider-val{font-family:'JetBrains Mono',monospace;font-size:0.72rem;color:#ff3e00;min-width:40px;text-align:right}
  .computed-area{text-align:center;padding:1.3rem 0 0.3rem}
  .computed-label{font-size:0.7rem;color:var(--dim)}
  .computed-value{font-family:'JetBrains Mono',monospace;font-size:2.1rem;font-weight:700;margin:0.4rem 0}
</style>
