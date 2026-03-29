import React from 'react';
import { Layout, Menu, Typography } from 'antd';

const { Header } = Layout;
const { Title } = Typography;

const Navbar = ({ vistaActiva, setVistaActiva }) => {
  const items = [
    { key: 'hoteles', label: 'Hoteles' },
    { key: 'equipos', label: 'Equipos y Clubes' },
    { key: 'asignacion', label: 'Asignación Automática' },
  ];

  return (
    <Header style={{ backgroundColor: '#fff', borderBottom: '1px solid #f0f0f0', height: 'auto', padding: '0 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Title level={4} style={{ margin: '16px 0', color: '#1677ff' }}>Gestión de Alojamientos💤</Title>
      </div>
      <Menu
        mode="horizontal"
        selectedKeys={[vistaActiva]}
        onClick={(e) => setVistaActiva(e.key)}
        items={items}
        style={{ borderBottom: 'none' }}
      />
    </Header>
  );
};

export default Navbar;

