import React, { useState } from 'react';
import { Layout } from 'antd';
import './App.css';

import Navbar from './components/layout/Navbar';
import Hoteles from './pages/Hoteles';
import Equipos from './pages/Equipos';
import Asignacion from './pages/Asignacion';

const { Content } = Layout;

function App() {
  const [vistaActiva, setVistaActiva] = useState('hoteles');

  return (
    <Layout className="min-vh-100">
      <Navbar vistaActiva={vistaActiva} setVistaActiva={setVistaActiva} />
      <Content className="main-content">
        {vistaActiva === 'hoteles' && <Hoteles />}
        {vistaActiva === 'equipos' && <Equipos />}
        {vistaActiva === 'asignacion' && <Asignacion />}
      </Content>
    </Layout>
  );
}

export default App;
