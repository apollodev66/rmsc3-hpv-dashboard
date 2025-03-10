import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import '@fontsource/poppins';
import { CssBaseline } from '@mui/material';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CssBaseline />
    <Router>  {/* ใช้ Router ที่นี่เท่านั้น */}
      <App />
    </Router>
  </React.StrictMode>
);
