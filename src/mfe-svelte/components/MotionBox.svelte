<script>
  import { ballX, ballY, ballSize, ballColor, ballShadow, clickCount } from '../stores.js';

  function handleClick(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    ballX.set(((e.clientX - rect.left) / rect.width) * 100);
    ballY.set(((e.clientY - rect.top) / rect.height) * 100);
    clickCount.update((c) => c + 1);
    window.__MFE_EVENT_BUS__?.emit('svelte:ball-moved', { x: $ballX, y: $ballY });
  }

  function handleKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
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
      width:{$ballSize}px;height:{$ballSize}px;
      left:calc({$ballX}% - {$ballSize/2}px);
      top:calc({$ballY}% - {$ballSize/2}px);
      background:{$ballColor};box-shadow:{$ballShadow};
    "
  ></div>
</div>

<style>
  .motion-box{height:200px;background:var(--surface-2);border-radius:10px;position:relative;overflow:hidden;cursor:crosshair;outline:none}
  .ball{border-radius:50%;position:absolute;transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1)}
</style>
