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
  Typography,
  Space,
  Divider,
  message,
  Popconfirm,
  Tooltip,
  DatePicker,
  Tag,
} from "antd";
import { DeleteOutlined, CloseOutlined } from "@ant-design/icons";
import api from "../services/api";
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

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
    const [start, end] = values.fechas_disponibilidad || [];

    const habitacionData = {
      ...values,
      disponible_desde: start ? start.format("YYYY-MM-DD") : null,
      disponible_hasta: end ? end.format("YYYY-MM-DD") : null,
    };
    delete habitacionData.fechas_disponibilidad;
    api
      .saveHabitacion(habitacionData)
      .then(() => {
        message.success("Habitación añadida con éxito");
        formHab.resetFields();
        cargarDatos();
      })
      .catch((error) => {
        console.error("Error al guardar habitación:", error);
        message.error("Error al conectar con el servidor.");
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
              rules={[
                {
                  required: true,
                  message: "Por favor, introduce el nombre del hotel.",
                },
              ]}
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
              <Checkbox>Cerca de bus🚌</Checkbox>
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
              rules={[
                { required: true, message: "Por favor, selecciona un hotel." },
              ]}
            >
              <Select placeholder="Seleccionar hotel">
                {hoteles.map((h) => (
                  <Option key={h.id} value={h.id}>
                    {h.nombre}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="tipo"
              label="Tipo"
              rules={[
                {
                  required: true,
                  message: "Por favor, selecciona el tipo de habitación.",
                },
              ]}
            >
              <Select placeholder="Selecciona el tipo">
                <Option value="1Persona">1 Persona</Option>
                <Option value="Doble">Doble</Option>
                <Option value="Triple">Triple</Option>
                <Option value="Cuádruple">Cuádruple</Option>
              </Select>
            </Form.Item>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item
                  name="capacidad"
                  label="Pax"
                  rules={[
                    {
                      required: true,
                      message:
                        "Por favor, introduce la capacidad de la habitación.",
                    },
                  ]}
                >
                  <Input type="number" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="cantidad_total"
                  label="Cantidad"
                  rules={[
                    {
                      required: true,
                      message:
                        "Por favor, introduce la cantidad de habitaciones.",
                    },
                  ]}
                >
                  <Input type="number" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="fechas_disponibilidad"
              label="Disponibilidad (Desde - Hasta)"
              rules={[
                {
                  required: true,
                  message: "¡Falta definir la disponibilidad!",
                },
              ]}
            >
              <RangePicker style={{ width: "100%" }} />
            </Form.Item>
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
                      ? "🚌Parada cercana"
                      : "Sin 🚌parada cercana"}
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
                      <Card
                        key={hab.id}
                        size="small"
                        style={{
                          marginBottom: 12,
                          width: "100%",
                          borderRadius: "8px",
                        }}
                        bodyStyle={{
                          padding: "12px",
                          backgroundColor: "#f9f9f9",
                        }}
                      >
                        <Row justify="space-between" align="top">
                          {/* 左侧：房型、容量和可用日期 */}
                          <Col flex="auto">
                            <Text
                              strong
                              style={{
                                fontSize: "14px",
                                display: "block",
                                marginBottom: 4,
                              }}
                            >
                              {hab.tipo}
                            </Text>
                            <Text
                              type="secondary"
                              style={{
                                fontSize: "12px",
                                display: "block",
                                marginBottom: 8,
                              }}
                            >
                              Capacidad: {hab.capacidad} pax/hab
                            </Text>

                            {/* 日期卡片区域*/}
                            {hab.disponible_desde && (
                              <Space
                                size={4}
                                style={{ display: "flex", flexWrap: "wrap" }}
                              >
                                <div className="mini-date-card checkin">
                                  <div className="mini-card-label">Desde</div>
                                  <div className="mini-card-value">
                                    {dayjs(hab.disponible_desde).format(
                                      "MMMM DD",
                                    )}
                                  </div>
                                </div>
                                <div className="mini-date-card checkout">
                                  <div className="mini-card-label">Hasta</div>
                                  <div className="mini-card-value">
                                    {dayjs(hab.disponible_hasta).format(
                                      "MMMM DD",
                                    )}
                                  </div>
                                </div>
                              </Space>
                            )}
                          </Col>

                          {/* 右侧：房间数量标签和删除按钮 */}
                          <Col
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-end",
                              justifyContent: "space-between",
                            }}
                          >
                            <Tag
                              color="#1677ff"
                              style={{
                                marginRight: 0,
                                marginBottom: 12,
                                borderRadius: "4px",
                                fontWeight: "bold",
                                border: "none",
                              }}
                            >
                              {hab.cantidad_total} DISPONIBLES
                            </Tag>

                            <Popconfirm
                              title="¿Eliminar esta habitación?"
                              onConfirm={() => handleDeleteHabitacion(hab.id)}
                              okText="Sí"
                              cancelText="No"
                            >
                              <Button
                                type="text"
                                danger
                                size="small"
                                icon={
                                  <CloseOutlined style={{ fontSize: "12px" }} />
                                }
                              />
                            </Popconfirm>
                          </Col>
                        </Row>
                      </Card>
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
