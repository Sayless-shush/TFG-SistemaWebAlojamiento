import React from 'react';
import { Layout, Menu, Typography, ConfigProvider } from 'antd';
import logoImg from '../../assets/logo.jpg';

const { Header } = Layout;
const { Title, Text } = Typography;

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
        padding: '24px 16px 0px 16px', 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '24px', 
          marginBottom: '24px',
          flexWrap: 'wrap' 
        }}>
          <img 
            src={logoImg}
            alt="Mare Nostrum Cup Logo" 
            style={{ 
              height: '80px', 
              objectFit: 'contain'
            }} 
          />
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <Title 
              level={1} 
              className="gradient-title" 
              style={{ 
                margin: 0, 
                fontSize: 'clamp(28px, 5vw, 42px)', 
                fontWeight: 800,
                letterSpacing: '-1px',
                lineHeight: '1.1'
              }}
            >
              Gestión de Alojamiento
            </Title>
            <Text type="secondary" style={{ fontSize: '18px', fontWeight: 500, letterSpacing: '0.5px' }}>
              Sistema Inteligente de Asignación Automática
            </Text>
          </div>
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