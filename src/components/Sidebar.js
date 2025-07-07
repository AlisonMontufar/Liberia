// src/components/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => (
  <aside className="sidebar">
    <h2>LibrosApp</h2>
    <NavLink to="/" end className="nav-link">Libros</NavLink>
    <NavLink to="/autores" className="nav-link">Autores</NavLink>
  </aside>
);

export default Sidebar;
