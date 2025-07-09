import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [correoOTelefono, setCorreoOTelefono] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('https://logins.somee.com/api/usuario/login', {
        correoOTelefono,
        contrasena,
      });
      alert(res.data);
      login();
      navigate('/libros');
    } catch (err) {
      setError(err.response?.data || 'Error en inicio de sesión');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Correo o Teléfono"
            value={correoOTelefono}
            onChange={e => setCorreoOTelefono(e.target.value)}
            required
          />
          <div style={{ position: 'relative' }}>
            <input
              type={mostrarContrasena ? 'text' : 'password'}
              placeholder="Contraseña"
              value={contrasena}
              onChange={e => setContrasena(e.target.value)}
              required
            />
            <span
              onClick={() => setMostrarContrasena(!mostrarContrasena)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: '#888',
              }}
              title={mostrarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {mostrarContrasena ? '🙈' : '👁️'}
            </span>
          </div>
          <button type="submit">Entrar</button>
          {error && <p className="error">{error}</p>}
        </form>
        <p>¿No tienes cuenta? <Link to="/registro">Regístrate</Link></p>
        <p>¿Olvidaste tu contraseña? <Link to="/recuperar">Recuperar</Link></p>
      </div>
    </div>
  );
};

export default Login;
