import { writable, derived } from 'svelte/store';

export const ballX = writable(50);
export const ballY = writable(50);
export const ballSize = writable(60);
export const ballHue = writable(14);
export const clickCount = writable(0);

export const ballColor = derived(ballHue, ($hue) => `hsl(${$hue}, 100%, 55%)`);
export const ballShadow = derived(ballHue, ($hue) => `0 0 40px hsla(${$hue}, 100%, 55%, 0.3)`);
export const ballArea = derived(ballSize, ($size) => Math.round(Math.PI * ($size / 2) * ($size / 2)));
