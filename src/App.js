// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LibrosPage from './pages/LibrosPage';
import AutoresPage from './pages/AutoresPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="main">
          <Routes>
            <Route path="/" element={<LibrosPage />} />
            <Route path="/autores" element={<AutoresPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
