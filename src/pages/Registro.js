import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Registro = () => {
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [preguntaSeguridad, setPreguntaSeguridad] = useState('');
  const [respuestaSeguridad, setRespuestaSeguridad] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('https://logins.somee.com/api/usuario/registro', {
        correo,
        telefono,
        contrasena,
        preguntaSeguridad,
        respuestaSeguridad,
      });
      alert(res.data);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data || 'Error en registro');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Registro</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Correo" value={correo} onChange={e => setCorreo(e.target.value)} required />
          <input type="tel" placeholder="Teléfono" value={telefono} onChange={e => setTelefono(e.target.value)} required />
          <input type="password" placeholder="Contraseña" value={contrasena} onChange={e => setContrasena(e.target.value)} required />
          <input type="text" placeholder="Pregunta de seguridad" value={preguntaSeguridad} onChange={e => setPreguntaSeguridad(e.target.value)} required />
          <input type="text" placeholder="Respuesta de seguridad" value={respuestaSeguridad} onChange={e => setRespuestaSeguridad(e.target.value)} required />
          <button type="submit">Registrarse</button>
          {error && <p className="error">{error}</p>}
        </form>
        <p>¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link></p>
      </div>
    </div>
  );
};

export default Registro;
