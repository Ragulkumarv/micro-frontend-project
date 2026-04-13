<script>
  import { ballX, ballY, ballSize, ballColor, ballShadow, clickCount } from '../stores.js';

  function handleClick(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    ballX.set(x);
    ballY.set(y);
    clickCount.update((c) => c + 1);

    if (window.__MFE_EVENT_BUS__) {
      window.__MFE_EVENT_BUS__.emit('svelte:ball-moved', { x, y });
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // Move ball to center on keyboard activation
      ballX.set(50);
      ballY.set(50);
      clickCount.update((c) => c + 1);
    }
  }
</script>

<div class="motion-box" on:click={handleClick} on:keydown={handleKeydown} role="button" tabindex="0">
  <div
    class="ball"
    style="
      width: {$ballSize}px;
      height: {$ballSize}px;
      left: calc({$ballX}% - {$ballSize / 2}px);
      top: calc({$ballY}% - {$ballSize / 2}px);
      background: {$ballColor};
      box-shadow: {$ballShadow};
    "
  ></div>
</div>

<style>
  .motion-box {
    height: 200px;
    background: #1a1a25;
    border-radius: 10px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
  }

  .ball {
    border-radius: 50%;
    position: absolute;
    transition:
      transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
      left 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
      top 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
      width 0.3s ease,
      height 0.3s ease;
  }
</style>
