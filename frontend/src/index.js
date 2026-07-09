/**
 * INDEX.JS - The actual entry point of the React app
 * 
 * This is the file that:
 * 1. Finds the <div id="root"> from public/index.html
 * 2. Tells React: "render my App component inside this div"
 * 
 * React.StrictMode: 
 *   - Development-only tool
 *   - Helps find bugs by intentionally double-invoking certain functions
 *   - Has NO effect in production builds
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Find the root DOM element (the div with id="root" in public/index.html)
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component tree into that DOM element
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
