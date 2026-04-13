// Module Federation requires an async boundary at the entry point.
// This ensures shared dependencies (react, vue, etc.) are resolved
// before the shell code runs.
import('./shell.js');
