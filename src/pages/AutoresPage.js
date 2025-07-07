import { useEffect, useState } from 'react';
import axios from 'axios';

const API_AUTORES = 'https://localhost:32785/api/Autor';

const AutoresPage = () => {
  const [autores, setAutores] = useState([]);
  const [form, setForm] = useState({ nombre: '', apellido: '', fechaNacimiento: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [editAutor, setEditAutor] = useState(null);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    fetchAutores();
  }, []);

  const fetchAutores = async () => {
    try {
      const res = await axios.get(API_AUTORES);
      setAutores(res.data);
    } catch (error) {
      alert('Error al cargar autores');
    }
  };

  // Validar campos simples
  const validar = (data) => {
    const errs = {};
    if (!data.nombre.trim()) errs.nombre = 'El nombre es obligatorio.';
    if (!data.apellido.trim()) errs.apellido = 'El apellido es obligatorio.';
    if (!data.fechaNacimiento) errs.fechaNacimiento = 'La fecha de nacimiento es obligatoria.';
    setErrores(errs);
    return Object.keys(errs).length === 0;
  };

  // Agregar autor
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar(form)) return;
    try {
      await axios.post(API_AUTORES, form);
      setForm({ nombre: '', apellido: '', fechaNacimiento: '' });
      fetchAutores();
    } catch (error) {
      alert('Error al agregar autor');
    }
  };

  // Editar autor - abre modal o formulario con datos
  const abrirEdicion = (autor) => {
    setEditAutor({
      ...autor,
      fechaNacimiento: autor.fechaNacimiento ? autor.fechaNacimiento.split('T')[0] : '',
    });
    setErrores({});
  };

  // Guardar edición
  const guardarEdicion = async (e) => {
    e.preventDefault();
    if (!validar(editAutor)) return;
    try {
      await axios.put(`${API_AUTORES}/modificar/${editAutor.autorLibroGuid}`, editAutor);
      setEditAutor(null);
      fetchAutores();
    } catch (error) {
      alert('Error al actualizar autor');
    }
  };

  // Eliminar autor
  const eliminarAutor = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este autor?')) return;
    try {
      await axios.delete(`${API_AUTORES}/eliminar/${id}`);
      fetchAutores();
    } catch (error) {
      alert('Error al eliminar autor');
    }
  };

  // Manejo de inputs (agregar o editar)
  const handleChange = (e, edit = false) => {
    const { name, value } = e.target;
    if (edit) {
      setEditAutor(prev => ({ ...prev, [name]: value }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
      setErrores(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Filtrado por búsqueda (nombre o apellido)
  const autoresFiltrados = autores.filter(
    a =>
      a.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.apellido.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page">
      <h1>👨‍🏫 Autores</h1>

      {/* Formulario agregar */}
      <form onSubmit={handleSubmit} className="form">
        <input
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        {errores.nombre && <small className="error">{errores.nombre}</small>}

        <input
          name="apellido"
          placeholder="Apellido"
          value={form.apellido}
          onChange={handleChange}
          required
        />
        {errores.apellido && <small className="error">{errores.apellido}</small>}

        <input
          type="date"
          name="fechaNacimiento"
          value={form.fechaNacimiento}
          onChange={handleChange}
          required
        />
        {errores.fechaNacimiento && <small className="error">{errores.fechaNacimiento}</small>}

        <button type="submit">Agregar</button>
      </form>

      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar por nombre o apellido..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ marginTop: 20, padding: '8px', width: '100%', maxWidth: 400 }}
      />

      <h2>Lista de autores</h2>

      {autoresFiltrados.length === 0 ? (
        <p>No se encontraron autores.</p>
      ) : (
        <table className="tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Fecha de Nacimiento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {autoresFiltrados.map(a => (
              <tr key={a.autorLibroGuid}>
                <td>{a.nombre}</td>
                <td>{a.apellido}</td>
                <td>{new Date(a.fechaNacimiento).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => abrirEdicion(a)}>Editar</button>
                  <button onClick={() => eliminarAutor(a.autorLibroGuid)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal / Formulario para editar autor */}
      {editAutor && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h3>✏️ Editar Autor</h3>
            <form onSubmit={guardarEdicion} className="form">
              <input
                name="nombre"
                placeholder="Nombre"
                value={editAutor.nombre}
                onChange={e => handleChange(e, true)}
                required
              />
              {errores.nombre && <small className="error">{errores.nombre}</small>}

              <input
                name="apellido"
                placeholder="Apellido"
                value={editAutor.apellido}
                onChange={e => handleChange(e, true)}
                required
              />
              {errores.apellido && <small className="error">{errores.apellido}</small>}

              <input
                type="date"
                name="fechaNacimiento"
                value={editAutor.fechaNacimiento}
                onChange={e => handleChange(e, true)}
                required
              />
              {errores.fechaNacimiento && <small className="error">{errores.fechaNacimiento}</small>}

              <div style={{ marginTop: 15 }}>
                <button type="submit">Guardar</button>
                <button type="button" onClick={() => setEditAutor(null)} style={{ marginLeft: 10 }}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .form input {
          margin-right: 10px;
          margin-bottom: 10px;
          padding: 6px;
        }
        .form button {
          padding: 6px 12px;
          cursor: pointer;
        }
        .tabla {
          border-collapse: collapse;
          width: 100%;
          max-width: 700px;
          margin-top: 10px;
        }
        .tabla th, .tabla td {
          border: 1px solid #ccc;
          padding: 8px;
          text-align: left;
        }
        .tabla th {
          background-color: #f4f4f4;
        }
        .tabla button {
          margin-right: 5px;
          padding: 4px 8px;
          cursor: pointer;
        }
        .modalOverlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }
        .modalContent {
          background: white;
          padding: 20px;
          border-radius: 6px;
          width: 90%;
          max-width: 400px;
        }
        .error {
          color: red;
          font-size: 12px;
          display: block;
          margin-top: -8px;
          margin-bottom: 8px;
        }
      `}</style>
    </div>
  );
};

export default AutoresPage;
