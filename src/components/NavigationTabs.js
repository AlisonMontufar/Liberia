import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './NavigationTabs.css';
import { useAuth } from '../context/AuthContext';

const NavigationTabs = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const cerrarSesion = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="tabContainer">
      <div className="tabsLeft">
        <NavLink to="/libros" className="tab" activeClassName="activeTab">
          📚 Libros
        </NavLink>
        <NavLink to="/autores" className="tab" activeClassName="activeTab">
          👨‍🏫 Autores
        </NavLink>
      </div>
      <button className="logoutButton" onClick={cerrarSesion} title="Cerrar sesión">
        🔓
      </button>
    </div>
  );
};

export default NavigationTabs;
