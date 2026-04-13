<script>
  import { ballX, ballY, ballSize, ballHue, clickCount, ballColor, ballArea } from '../stores.js';
</script>

<div class="store-display">
  <div class="store-item">
    <span class="store-key">ballX</span>
    <span class="store-val">{$ballX.toFixed(0)}%</span>
  </div>
  <div class="store-item">
    <span class="store-key">ballY</span>
    <span class="store-val">{$ballY.toFixed(0)}%</span>
  </div>
  <div class="store-item">
    <span class="store-key">size</span>
    <span class="store-val">{$ballSize}px</span>
  </div>
  <div class="store-item">
    <span class="store-key">hue</span>
    <span class="store-val">{$ballHue}°</span>
  </div>
  <div class="store-item">
    <span class="store-key">color</span>
    <span class="store-val">{$ballColor}</span>
  </div>
  <div class="store-item">
    <span class="store-key">clicks</span>
    <span class="store-val">{$clickCount}</span>
  </div>
  <div class="store-item">
    <span class="store-key">area (derived)</span>
    <span class="store-val">{$ballArea}px²</span>
  </div>
</div>

<style>
  .store-display {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .store-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.7rem 1rem;
    background: #1a1a25;
    border-radius: 8px;
    font-size: 0.82rem;
  }

  .store-key {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    color: #ff3e00;
  }

  .store-val {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    color: #6b6b80;
  }
</style>
