// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LibrosPage from './pages/LibrosPage';
import AutoresPage from './pages/AutoresPage';
import Login from './pages/Login';
import Registro from './pages/Registro';
import RecuperarContrasena from './pages/RecuperarContrasena';
import { useAuth } from './context/AuthContext';
import NavigationTabs from './components/NavigationTabs';
import './App.css';

const AppRoutes = () => {
  const { autenticado } = useAuth();
  const location = useLocation();

  const esVistaProtegida = ["/libros", "/autores"].includes(location.pathname);

  return (
    <>
      {autenticado && esVistaProtegida && <NavigationTabs />}
      <div className="page">
        <Routes>
          <Route path="/" element={autenticado ? <Navigate to="/libros" /> : <Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/recuperar" element={<RecuperarContrasena />} />
          <Route
            path="/libros"
            element={autenticado ? <LibrosPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/autores"
            element={autenticado ? <AutoresPage /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
