import React from 'react';
import { Layout, Menu, Typography, ConfigProvider } from 'antd';

const { Header } = Layout;
const { Title } = Typography;

const Navbar = ({ vistaActiva, setVistaActiva }) => {
  const items = [
    { key: 'hoteles', label: 'HOTEL Y HABITACIONES' },
    { key: 'equipos', label: 'CLUB Y EQUIPOS' },
    { key: 'asignacion', label: 'ASIGNACIÓN AUTOMÁTICA' },
  ];

 
  const getMenuClass = () => {
    switch(vistaActiva) {
      case 'hoteles': return 'menu-hoteles';
      case 'equipos': return 'menu-equipos';
      case 'asignacion': return 'menu-asignacion';
      default: return 'menu-hoteles';
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            itemHeight: 60,
            fontSize: 18,
          },
        },
      }}
    >
      <Header style={{ 
        backgroundColor: '#fff', 
        borderBottom: '1px solid #f0f0f0', 
        height: 'auto', 
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title 
            level={1} 
            className="gradient-title"
            style={{ 
              margin: 0, 
              fontSize: 'clamp(32px, 6vw, 48px)',
              fontWeight: 800,
              letterSpacing: '-1.5px'
            }}
          >
            Gestión de Alojamientos💤
          </Title>
        </div>
        <Menu
          mode="horizontal"
          selectedKeys={[vistaActiva]}
          onClick={(e) => setVistaActiva(e.key)}
          items={items}
          style={{ 
            borderBottom: 'none',
            justifyContent: 'center',
            width: '100%',
            lineHeight: '60px',
            textTransform: 'uppercase',
            fontWeight: '600'
          }}
          className={`custom-nav-menu ${getMenuClass()}`}
        />
      </Header>
    </ConfigProvider>
  );
};

export default Navbar;
