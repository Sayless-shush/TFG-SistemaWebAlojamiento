import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Checkbox,
  Row,
  Col,
  Badge,
  Typography,
  Space,
  Divider,
  message,
  Popconfirm,
  Tooltip,
} from "antd";
import { DeleteOutlined, CloseOutlined } from "@ant-design/icons";
import api from "../services/api";

const { Title, Text } = Typography;
const { Option } = Select;

const Hoteles = () => {
  const [hoteles, setHoteles] = useState([]);
  const [habitaciones, setHabitaciones] = useState([]);
  const [formHotel] = Form.useForm();
  const [formHab] = Form.useForm();

  const cargarDatos = () => {
    api.getHoteles().then((datos) => setHoteles(datos));
    api.getHabitaciones().then((datos) => setHabitaciones(datos));
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const onFinishHotel = (values) => {
    api
      .saveHotel({
        ...values,
        cerca_autobus: values.cerca_autobus ? 1 : 0,
      })
      .then(() => {
        message.success("Hotel guardado correctamente");
        formHotel.resetFields();
        cargarDatos();
      });
  };

  const onFinishHabitacion = (values) => {
    api.saveHabitacion(values).then(() => {
      message.success("Habitación añadida");
      formHab.resetFields();
      cargarDatos();
    });
  };

  const handleDeleteHotel = (id) => {
    api
      .deleteHotel(id)
      .then(() => {
        message.success("Hotel eliminado correctamente");
        cargarDatos();
      })
      .catch((err) => {
        message.error("Error al eliminar el hotel");
      });
  };
  const handleDeleteHabitacion = (id) => {
    api
      .deleteHabitacion(id)
      .then(() => {
        message.success("Habitación eliminada");
        cargarDatos();
      })
      .catch((err) => {
        message.error("Error al eliminar la habitación");
      });
  };

  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} md={8}>
        <Card
          title="Añadir Nuevo Hotel"
          size="small"
          className="cool-card card-hotel-form"
          style={{ marginBottom: 24 }}
          headStyle={{ color: "#1677ff" }}
        >
          <Form form={formHotel} layout="vertical" onFinish={onFinishHotel}>
            <Form.Item
              name="nombre"
              label="Nombre"
              rules={[{ required: true, message: 'Por favor, introduce el nombre del hotel.' }]}
            >
              <Input placeholder="Ej: Hotel Gran Playa" />
            </Form.Item>
            <Form.Item
              name="categoria"
              label="Categoría"
              initialValue="3 estrellas"
            >
              <Select>
                <Option value="3 estrellas">3 estrellas</Option>
                <Option value="4 estrellas">4 estrellas</Option>
                <Option value="5 estrellas">5 estrellas</Option>
                <Option value="Resort">Resort</Option>
                <Option value="Apartamento">Apartamento</Option>
              </Select>
            </Form.Item>
            <Form.Item name="cerca_autobus" valuePropName="checked">
              <Checkbox>Cerca de bus</Checkbox>
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              className="btn-hotel"
            >
              Guardar Hotel
            </Button>
          </Form>
        </Card>

        <Card
          title="Añadir Habitaciones"
          size="small"
          className="cool-card card-hotel-form"
          headStyle={{ color: "#1677ff" }}
        >
          <Form form={formHab} layout="vertical" onFinish={onFinishHabitacion}>
            <Form.Item
              name="hotel_id"
              label="Hotel"
              rules={[{ required: true, message: 'Por favor, selecciona un hotel.' }]}
            >
              <Select placeholder="Seleccionar hotel">
                {hoteles.map((h) => (
                  <Option key={h.id} value={h.id}>
                    {h.nombre}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="tipo" 
              label="Tipo" 
              rules={[{ required: true, message: 'Por favor, introduce el tipo de habitación.' }]}
            >
              <Input placeholder="Ej: Doble, Triple" />
            </Form.Item>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item
                  name="capacidad"
                  label="Pax"
                  rules={[{ required: true, message: 'Por favor, introduce la capacidad de la habitación.' }]}
                >
                  <Input type="number" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="cantidad_total"
                  label="Cantidad"
                  rules={[{ required: true, message: 'Por favor, introduce la cantidad de habitaciones.' }]}
                >
                  <Input type="number" />
                </Form.Item>
              </Col>
            </Row>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              className="btn-hotel"
            >
              Añadir Habitación
            </Button>
          </Form>
        </Card>
      </Col>

      <Col xs={24} md={16}>
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          {hoteles.map((hotel) => (
            <Card
              key={hotel.id}
              hoverable
              className="cool-card card-hotel"
              bodyStyle={{ padding: "16px 24px" }}
            >
              <Row justify="space-between" align="middle">
                <Col>
                  <Title level={5} style={{ margin: 0, color: "#1677ff" }}>
                    {hotel.nombre}{" "}
                    <Text
                      type="secondary"
                      style={{ fontSize: "14px", fontWeight: "normal" }}
                    >
                      ({hotel.categoria})
                    </Text>
                  </Title>
                  <Text type="secondary" size="small">
                    {hotel.cerca_autobus
                      ? "Parada cercana"
                      : "Sin parada cercana"}
                  </Text>
                </Col>
                <Col>
                  <Tooltip title="Eliminar hotel">
                    <Popconfirm
                      title="¿Eliminar este hotel?"
                      description="Se borrarán también todas sus habitaciones. Esta acción no se puede deshacer."
                      onConfirm={() => handleDeleteHotel(hotel.id)}
                      okText="sí, adéu"
                      cancelText="Cancelar"
                    >
                      <Button
                        danger
                        type="text"
                        size="small"
                        icon={<DeleteOutlined />}
                      />
                    </Popconfirm>
                  </Tooltip>
                </Col>
              </Row>

              <Divider style={{ margin: "12px 0" }} />

              <Text
                strong
                style={{ fontSize: "12px", display: "block", marginBottom: 8 }}
              >
                HABITACIONES DISPONIBLES:
              </Text>
              <Space wrap>
                {habitaciones.filter((hab) => hab.hotel_id === hotel.id)
                  .length === 0 ? (
                  <Text type="secondary" italic>
                    Sin habitaciones registradas.
                  </Text>
                ) : (
                  habitaciones
                    .filter((hab) => hab.hotel_id === hotel.id)
                    .map((hab) => (
                      <Badge
                        key={hab.id}
                        count={`x${hab.cantidad_total}`}
                        offset={[5, 0]}
                        color="#1677ff"
                      >
                        <Card
                          size="small"
                          bodyStyle={{
                            padding: "4px 8px",
                            backgroundColor: "#f5f5f5",
                          }}
                        >
                          <Row align="middle" gutter={8}>
                            <Col>
                              <Text size="small">
                                {hab.tipo} ({hab.capacidad} pax)
                              </Text>
                            </Col>
                            <Col>
                              <Popconfirm
                                title="¿Eliminar habitación?"
                                onConfirm={() => handleDeleteHabitacion(hab.id)}
                                okText="Sí"
                                cancelText="No"
                              >
                                <CloseOutlined
                                  style={{
                                    fontSize: "10px",
                                    color: "#ff4d4f",
                                    cursor: "pointer",
                                  }}
                                />
                              </Popconfirm>
                            </Col>
                          </Row>
                        </Card>
                      </Badge>
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

export default Hoteles;
