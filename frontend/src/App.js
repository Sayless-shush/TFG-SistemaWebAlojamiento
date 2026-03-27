import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Aquí guardaremos la lista de hoteles que nos envíe el backend
  const [hoteles, setHoteles] = useState([]);

  // Esto hace que la web pida los datos nada más cargar
  useEffect(() => {
    fetch('http://localhost:3000/api/hoteles')
      .then(respuesta => respuesta.json())
      .then(datos => setHoteles(datos))
      .catch(error => console.error("Error al cargar hoteles:", error));
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>🏨 Panel de Gestión de Hoteles</h1>
      <h2>Hoteles Disponibles en la Base de Datos:</h2>
      
      <ul>
        {hoteles.map((hotel) => (
          <li key={hotel.id} style={{ marginBottom: '10px', fontSize: '18px' }}>
            <strong>{hotel.nombre}</strong> - {hotel.categoria} 
            {hotel.cerca_autobus ? " (🚌 Cerca de parada)" : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;