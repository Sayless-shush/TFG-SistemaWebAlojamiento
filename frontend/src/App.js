import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [vistaActiva, setVistaActiva] = useState('equipos');

  // --- ESTADOS DE HOTELES ---
  const [hoteles, setHoteles] = useState([]);
  const [nombreHotel, setNombreHotel] = useState('');
  const [categoria, setCategoria] = useState('3 estrellas');
  const [cercaAutobus, setCercaAutobus] = useState(false);

  // --- ESTADOS DE CLUBES Y EQUIPOS ---
  const [clubes, setClubes] = useState([]);
  const [equipos, setEquipos] = useState([]);
  
  // Formulario Club
  const [nombreClub, setNombreClub] = useState('');
  const [contactoNombre, setContactoNombre] = useState('');
  const [contactoEmail, setContactoEmail] = useState('');
  
  // Formulario Equipo
  const [equipoClubId, setEquipoClubId] = useState('');
  const [equipoCategoria, setEquipoCategoria] = useState('');
  const [equipoJugadores, setEquipoJugadores] = useState('');

  // --- CARGAR DATOS ---
  const cargarDatos = () => {
    fetch('http://localhost:3000/api/hoteles').then(res => res.json()).then(datos => setHoteles(datos));
    fetch('http://localhost:3000/api/clubes').then(res => res.json()).then(datos => {
        setClubes(datos);
        if(datos.length > 0 && equipoClubId === '') setEquipoClubId(datos[0].id); 
    });
    fetch('http://localhost:3000/api/equipos').then(res => res.json()).then(datos => setEquipos(datos));
  };

  useEffect(() => { cargarDatos(); }, []);

  // Guardar los nuevos datos 
  const guardarHotel = (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/api/hoteles', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ nombre: nombreHotel, categoria, cerca_autobus: cercaAutobus ? 1 : 0 })
    }).then(() => { cargarDatos(); setNombreHotel(''); });
  };

  const guardarClub = (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/api/clubes', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ nombre: nombreClub, contacto_nombre: contactoNombre, contacto_email: contactoEmail })
    }).then(() => { cargarDatos(); setNombreClub(''); setContactoNombre(''); setContactoEmail(''); });
  };

  const guardarEquipo = (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/api/equipos', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ club_id: equipoClubId, categoria: equipoCategoria, num_jugadores: equipoJugadores })
    }).then(() => { cargarDatos(); setEquipoCategoria(''); setEquipoJugadores(''); });
  };

  return (
    <div className="bg-light min-vh-100 pb-5">
      <nav className="navbar navbar-dark bg-primary shadow-sm">
        <div className="container">
          <span className="navbar-brand mb-0 h1">🏆 TFG - Gestión de Alojamientos</span>
        </div>
      </nav>

      <div className="bg-white border-bottom shadow-sm mb-4">
        <div className="container">
          <ul className="nav nav-underline py-2">
            <li className="nav-item">
              <button className={`nav-link border-0 bg-transparent fs-5 ${vistaActiva === 'hoteles' ? 'active fw-bold' : 'text-secondary'}`} onClick={() => setVistaActiva('hoteles')}>🏨 Hoteles</button>
            </li>
            <li className="nav-item">
              <button className={`nav-link border-0 bg-transparent fs-5 ${vistaActiva === 'equipos' ? 'active fw-bold' : 'text-secondary'}`} onClick={() => setVistaActiva('equipos')}>⚽ Equipos y Clubes</button>
            </li>
            <li className="nav-item">
              <button className={`nav-link border-0 bg-transparent fs-5 ${vistaActiva === 'asignacion' ? 'active fw-bold' : 'text-secondary'}`} onClick={() => setVistaActiva('asignacion')}>⚙️ Asignación Automática</button>
            </li>
          </ul>
        </div>
      </div>

      <div className="container">
        
        {/* HOTELES */}
        {vistaActiva === 'hoteles' && (
          <div className="row">
             {/* El código de hoteles sigue aquí igual que antes... */}
             <div className="col-md-4 mb-4">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <h5 className="card-title text-success mb-3">➕ Añadir Nuevo Hotel</h5>
                  <form onSubmit={guardarHotel}>
                    <div className="mb-3">
                      <label className="form-label">Nombre</label>
                      <input type="text" className="form-control" required value={nombreHotel} onChange={(e) => setNombreHotel(e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Categoría</label>
                      <select className="form-select" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                        <option value="3 estrellas">3 estrellas</option>
                        <option value="4 estrellas">4 estrellas</option>
                        <option value="4 estrellas">5 estrellas</option>
                        <option value="4 estrellas">Resort</option>
                        <option value="4 estrellas">Apartamento</option>
                      </select>
                    </div>
                    <div className="mb-3 form-check">
                      <input type="checkbox" className="form-check-input" id="bus" checked={cercaAutobus} onChange={(e) => setCercaAutobus(e.target.checked)} />
                      <label className="form-check-label" htmlFor="bus">Cerca de bus</label>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Guardar</button>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="row">
                {hoteles.map((hotel) => (
                  <div className="col-md-6 mb-4" key={hotel.id}><div className="card h-100 shadow-sm border-0"><div className="card-body"><h5 className="card-title text-primary fw-bold">{hotel.nombre}</h5><p className="card-text">{hotel.cerca_autobus ? "🚌 Parada cercana" : "❌ Sin parada cercana"}</p></div></div></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CLUBES Y EQUIPOS */}
        {vistaActiva === 'equipos' && (
          <div className="row">
            {/* Formularios */}
            <div className="col-md-4 mb-4">
              
              {/* Formulario de Club */}
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-body">
                  <h5 className="card-title text-success mb-3">🛡️ Añadir Nuevo Club</h5>
                  <form onSubmit={guardarClub}>
                    <div className="mb-3"><input type="text" className="form-control" required placeholder="Nombre (Ej: FC Barcelona)" value={nombreClub} onChange={(e) => setNombreClub(e.target.value)} /></div>
                    <div className="mb-3"><input type="text" className="form-control" placeholder="Contacto (Ej: Joan)" value={contactoNombre} onChange={(e) => setContactoNombre(e.target.value)} /></div>
                    <button type="submit" className="btn btn-outline-success w-100">Crear Club</button>
                  </form>
                </div>
              </div>

              {/* Formulario de Equipo */}
              <div className="card shadow-sm border-0 bg-light">
                <div className="card-body">
                  <h5 className="card-title text-primary mb-3">⚽ Añadir Categoría (Equipo)</h5>
                  <form onSubmit={guardarEquipo}>
                    <div className="mb-3">
                      <label className="form-label text-muted small">Selecciona el Club</label>
                      <select className="form-select" required value={equipoClubId} onChange={(e) => setEquipoClubId(e.target.value)}>
                        {clubes.map(club => <option key={club.id} value={club.id}>{club.nombre}</option>)}
                      </select>
                    </div>
                    <div className="mb-3">
                      <input type="text" className="form-control" required placeholder="Categoría (Ej: U12, Femenino)" value={equipoCategoria} onChange={(e) => setEquipoCategoria(e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <input type="number" className="form-control" required placeholder="Nº Jugadores" value={equipoJugadores} onChange={(e) => setEquipoJugadores(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Añadir Equipo</button>
                  </form>
                </div>
              </div>

            </div>

            {/* Listado de clubs con equipos */}
            <div className="col-md-8">
              <div className="row">
                {clubes.map((club) => (
                  <div className="col-12 mb-3" key={club.id}>
                    <div className="card shadow-sm border-0 border-start border-primary border-4">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h5 className="card-title text-primary fw-bold mb-0">{club.nombre}</h5>
                          <small className="text-muted">👤 {club.contacto_nombre}</small>
                        </div>
                        
                        {/* Filtrar y mostrar equipos del club */}
                        <div className="d-flex flex-wrap gap-2 mt-3">
                          {equipos.filter(equipo => equipo.club_id === club.id).length === 0 ? (
                            <span className="text-muted small">No hay equipos registrados aún.</span>
                          ) : (
                            equipos.filter(equipo => equipo.club_id === club.id).map(equipo => (
                              <span key={equipo.id} className="badge bg-secondary p-2 fs-6">
                                {equipo.categoria} <span className="badge bg-light text-dark ms-1">{equipo.num_jugadores} jug.</span>
                              </span>
                            ))
                          )}
                        </div>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;