// Async boundary — required for Module Federation shared dependencies.
// When running standalone (npm start in mfe-react/), this loads the app.
// When loaded as a remote by the shell, the shell imports './App' directly
// via the exposes config, bypassing this file.
import('./index.jsx');
