import React, { useState } from 'react';
import axios from 'axios';

const RecuperarContrasena = () => {
  const [correoOTelefono, setCorreoOTelefono] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [paso, setPaso] = useState(1);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const verificarRespuesta = async () => {
    setError('');
    try {
      await axios.post('https://logins.somee.com/api/usuario/verificar-pregunta', {
        correoOTelefono,
        respuesta,
      });
      setPaso(2);
      setMensaje('Respuesta correcta. Ahora ingresa tu nueva contraseña.');
    } catch (err) {
      setError(err.response?.data || 'Respuesta incorrecta');
    }
  };

  const cambiarContrasena = async () => {
    setError('');
    try {
      await axios.put('https://logins.somee.com/api/usuario/recuperar-contrasena', {
        correoOTelefono,
        nuevaContrasena,
      });
      setMensaje('Contraseña actualizada con éxito.');
      setPaso(3);
    } catch (err) {
      setError(err.response?.data || 'Error al actualizar la contraseña');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Recuperar Contraseña</h2>
        {paso === 1 && (
          <>
            <input type="text" placeholder="Correo o Teléfono" value={correoOTelefono} onChange={e => setCorreoOTelefono(e.target.value)} required />
            <input type="text" placeholder="Respuesta a la pregunta de seguridad" value={respuesta} onChange={e => setRespuesta(e.target.value)} required />
            <button onClick={verificarRespuesta}>Verificar</button>
          </>
        )}
        {paso === 2 && (
          <>
            <input type="password" placeholder="Nueva contraseña" value={nuevaContrasena} onChange={e => setNuevaContrasena(e.target.value)} required />
            <button onClick={cambiarContrasena}>Cambiar contraseña</button>
          </>
        )}
        {paso === 3 && <p>{mensaje}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default RecuperarContrasena;
