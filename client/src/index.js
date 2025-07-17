import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DarkModeProvider } from './context/DarkModeContext';
import { AnimatePresence } from 'framer-motion';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <DarkModeProvider> {/* ✅ Wrap the entire app with this */}
      <BrowserRouter>
        <AuthProvider>
          <AnimatePresence mode='wait'>
            <App />
          </AnimatePresence>
        </AuthProvider>
      </BrowserRouter>
    </DarkModeProvider>
  </React.StrictMode>
);
