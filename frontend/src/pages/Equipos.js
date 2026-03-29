import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Select, Button, Row, Col, Typography, Space, Tag, message, Divider } from 'antd';
import api from '../services/api';

const { Title, Text } = Typography;
const { Option } = Select;

const Equipos = () => {
  const [clubes, setClubes] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [formClub] = Form.useForm();
  const [formEquipo] = Form.useForm();

  const cargarDatos = () => {
    api.getClubes().then(datos => setClubes(datos));
    api.getEquipos().then(datos => setEquipos(datos));
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const onFinishClub = (values) => {
    api.saveClub(values).then(() => {
      message.success('Club creado correctamente');
      formClub.resetFields();
      cargarDatos();
    });
  };

  const onFinishEquipo = (values) => {
    api.saveEquipo(values).then(() => {
      message.success('Equipo añadido al club');
      formEquipo.resetFields();
      cargarDatos();
    });
  };

  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} md={8}>
        <Card title="Añadir Nuevo Club" size="small" style={{ marginBottom: 24 }} headStyle={{ color: '#52c41a' }}>
          <Form form={formClub} layout="vertical" onFinish={onFinishClub}>
            <Form.Item name="nombre" label="Nombre Club" rules={[{ required: true }]}>
              <Input placeholder="Ej: FC Barcelona" />
            </Form.Item>
            <Form.Item name="contacto_nombre" label="Contacto">
              <Input placeholder="Nombre o Email" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block style={{ backgroundColor: '#52c41a' }}>Crear Club</Button>
          </Form>
        </Card>

        <Card title="Añadir Categoría (Equipo)" size="small" headStyle={{ color: '#1677ff' }}>
          <Form form={formEquipo} layout="vertical" onFinish={onFinishEquipo}>
            <Form.Item name="club_id" label="Club" rules={[{ required: true }]}>
              <Select placeholder="Seleccionar club">
                {clubes.map(club => <Option key={club.id} value={club.id}>{club.nombre}</Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="categoria" label="Categoría" rules={[{ required: true }]}>
              <Input placeholder="Ej: U12, Femenino" />
            </Form.Item>
            <Form.Item name="num_jugadores" label="Nº Jugadores" rules={[{ required: true }]}>
              <Input type="number" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>Añadir Equipo</Button>
          </Form>
        </Card>
      </Col>

      <Col xs={24} md={16}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {clubes.map((club) => (
            <Card 
              key={club.id} 
              hoverable 
              style={{ borderLeft: '4px solid #1677ff' }}
              bodyStyle={{ padding: '16px 24px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Title level={5} style={{ margin: 0, color: '#1677ff' }}>{club.nombre}</Title>
                  <Text type="secondary">{club.contacto_nombre}</Text>
                </div>
              </div>
              
              <Divider style={{ margin: '12px 0' }} />

              <Space wrap>
                {equipos.filter(equipo => equipo.club_id === club.id).length === 0 ? (
                  <Text type="secondary" italic>No hay equipos registrados aún.</Text>
                ) : (
                  equipos.filter(equipo => equipo.club_id === club.id).map(equipo => (
                    <Tag color="blue" key={equipo.id} style={{ padding: '4px 8px', fontSize: '14px' }}>
                      <Text strong>{equipo.categoria}</Text>
                      <Divider type="vertical" />
                      {equipo.num_jugadores} jug.
                    </Tag>
                  ))
                )}
              </Space>
            </Card>
          ))}
        </Space>
      </Col>
    </Row>
  );
};

export default Equipos;
