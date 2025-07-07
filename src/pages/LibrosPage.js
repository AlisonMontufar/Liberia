import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_LIBROS = 'https://libromicroservicio.somee.com/api/LibroMaterial';
const API_AUTORES = 'https://localhost:32781/api/Autor';

const LibrosPage = () => {
  const [libros, setLibros] = useState([]);
  const [autores, setAutores] = useState([]);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({ titulo: '', fechaPublicacion: '', autorLibros: [] });
  const [errors, setErrors] = useState({});

  const fetchAll = async () => {
    try {
      const [resLibros, resAutores] = await Promise.all([
        axios.get(API_LIBROS),
        axios.get(API_AUTORES)
      ]);
      setLibros(resLibros.data);
      setAutores(resAutores.data);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const validate = () => {
    const errs = {};
    if (!form.titulo.trim()) errs.titulo = 'Título requerido';
    if (!form.fechaPublicacion) errs.fecha = 'Fecha requerida';
    if (!form.autorLibros.length) errs.autores = 'Selecciona al menos un autor';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      Titulo: form.titulo,
      FechaPublicacion: new Date(form.fechaPublicacion).toISOString(),
      AutorLibros: form.autorLibros  // <-- Envío directo array de GUIDs
    };

    console.log("Payload a enviar:", payload);

    try {
      if (edit) {
        await axios.put(`${API_LIBROS}/${edit.libreriaMaterialId}`, payload);
        setEdit(null);
      } else {
        await axios.post(API_LIBROS, payload);
      }
      setForm({ titulo: '', fechaPublicacion: '', autorLibros: [] });
      fetchAll();
    } catch (error) {
      console.error("Error al guardar libro:", error.response?.data || error.message);
      alert('Error al guardar libro');
    }
  };

  const handleDelete = async id => {
    if (window.confirm('¿Eliminar libro?')) {
      await axios.delete(`${API_LIBROS}/${id}`);
      fetchAll();
    }
  };

  const loadEdit = libro => {
    setEdit(libro);
    setForm({
      titulo: libro.titulo,
      fechaPublicacion: libro.fechaPublicacion.split('T')[0],
      autorLibros: libro.autorLibros // Aquí debe ser un array de GUIDs
    });
    setErrors({});
  };

  const handleSelect = e => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setForm(prev => ({ ...prev, autorLibros: selected }));
  };

  return (
    <div className="main">
      <div className="card">
        <h2>{edit ? 'Editar Libro' : 'Agregar Libro'}</h2>
        <form onSubmit={handleSubmit}>
          <label>Título</label>
          <input
            name="titulo"
            value={form.titulo}
            onChange={e => setForm({ ...form, titulo: e.target.value })}
          />
          {errors.titulo && <p className="errorMsg">{errors.titulo}</p>}

          <label>Fecha publicación</label>
          <input
            type="date"
            value={form.fechaPublicacion}
            onChange={e => setForm({ ...form, fechaPublicacion: e.target.value })}
          />
          {errors.fecha && <p className="errorMsg">{errors.fecha}</p>}

          <label>Autores</label>
          <select
            multiple
            value={form.autorLibros}
            onChange={handleSelect}
            style={{ width: '100%', height: '120px' }}
          >
            {autores.map(a => (
              <option key={a.autorLibroGuid} value={a.autorLibroGuid}>
                {a.nombre} {a.apellido}
              </option>
            ))}
          </select>
          {errors.autores && <p className="errorMsg">{errors.autores}</p>}

          <button type="submit" className="btnPrimary">
            {edit ? 'Actualizar' : 'Guardar'}
          </button>
          {edit && (
            <button
              type="button"
              className="btnSecondary"
              onClick={() => {
                setEdit(null);
                setForm({ titulo: '', fechaPublicacion: '', autorLibros: [] });
              }}
            >
              Cancelar
            </button>
          )}
        </form>
      </div>

      <div className="card">
        <h2>Lista de Libros</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {libros.map(l => (
              <tr key={l.libreriaMaterialId}>
                <td>{l.titulo}</td>
                <td>{new Date(l.fechaPublicacion).toLocaleDateString()}</td>
                
                <td>
                  <button className="btnSecondary" onClick={() => loadEdit(l)}>Editar</button>
                  <button className="btnDanger" onClick={() => handleDelete(l.libreriaMaterialId)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LibrosPage;
