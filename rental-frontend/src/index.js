import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Path-only URLs (/reset-password?token=) → /#/reset-password?token= for HashRouter.
(function pathToHash() {
  const { hash, pathname, search } = window.location;
  if (hash.length > 1 && hash.startsWith('#/')) return;
  const base = process.env.NODE_ENV === 'production' ? (process.env.PUBLIC_URL || '').replace(/\/$/, '') : '';
  let p = pathname;
  if (base && p.startsWith(base)) p = p.slice(base.length) || '/';
  if (p === '/' || p === '') return;
  const pathPart = p.startsWith('/') ? p : `/${p}`;
  window.history.replaceState(null, '', `${window.location.origin}${base}/#${pathPart}${search}`);
})();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <App />

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
