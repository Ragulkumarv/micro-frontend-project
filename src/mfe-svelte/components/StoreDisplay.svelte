<script>
  import { ballX, ballY, ballSize, ballHue, clickCount, ballColor, ballArea } from '../stores.js';
</script>

<div class="store-display">
  {#each [
    ['ballX', `${$ballX.toFixed(0)}%`],
    ['ballY', `${$ballY.toFixed(0)}%`],
    ['size', `${$ballSize}px`],
    ['hue', `${$ballHue}°`],
    ['color', $ballColor],
    ['clicks', $clickCount],
    ['area (derived)', `${$ballArea}px²`],
  ] as [key, val]}
    <div class="store-item">
      <span class="store-key">{key}</span>
      <span class="store-val">{val}</span>
    </div>
  {/each}
</div>

<style>
  .store-display{display:flex;flex-direction:column;gap:0.45rem}
  .store-item{display:flex;justify-content:space-between;padding:0.6rem 0.9rem;background:var(--surface-2);border-radius:8px;font-size:0.8rem}
  .store-key{font-family:'JetBrains Mono',monospace;font-size:0.72rem;color:#ff3e00}
  .store-val{font-family:'JetBrains Mono',monospace;font-size:0.72rem;color:var(--dim)}
</style>
