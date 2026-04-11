const BASE_URL = 'http://localhost:3000/api';

const api = {
  //HOTELES
  getHoteles: () => fetch(`${BASE_URL}/hoteles`).then(res => res.json()),
  saveHotel: (hotel) => fetch(`${BASE_URL}/hoteles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(hotel)
  }).then(res => res.json()),

  //CLUBES
  getClubes: () => fetch(`${BASE_URL}/clubes`).then(res => res.json()),
  saveClub: (club) => fetch(`${BASE_URL}/clubes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(club)
  }).then(res => res.json()),

  //EQUIPOS
  getEquipos: () => fetch(`${BASE_URL}/equipos`).then(res => res.json()),
  saveEquipo: (equipo) => fetch(`${BASE_URL}/equipos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(equipo)
  }).then(res => res.json()),

  //HABITACIONES
  getHabitaciones: () => fetch(`${BASE_URL}/habitaciones`).then(res => res.json()),
  saveHabitacion: (habitacion) => fetch(`${BASE_URL}/habitaciones`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(habitacion)
  }).then(res => res.json()),
};

export default api;
