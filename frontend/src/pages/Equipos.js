import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Typography,
  Tag,
  Space,
  Divider,
  message,
  Popconfirm,
  Tooltip,
  DatePicker,
} from "antd";
import { DeleteOutlined, CloseOutlined } from "@ant-design/icons";
import api from "../services/api";
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Equipos = () => {
  const [clubes, setClubes] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [formClub] = Form.useForm();
  const [formEquipo] = Form.useForm();

  const cargarDatos = () => {
    api.getClubes().then((datos) => setClubes(datos));
    api.getEquipos().then((datos) => setEquipos(datos));
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const onFinishClub = (values) => {
    api.saveClub(values).then(() => {
      message.success("Club creado correctamente");
      formClub.resetFields();
      cargarDatos();
    });
  };

  const onFinishEquipo = (values) => {
    api.saveEquipo(values).then(() => {
      message.success("Equipo añadido al club");
      formEquipo.resetFields();
      cargarDatos();
    });
  };

  const handleDeleteClub = (id) => {
    api
      .deleteClub(id)
      .then(() => {
        message.success("Club eliminado correctamente");
        cargarDatos();
      })
      .catch((err) => {
        message.error("Error al eliminar el club");
      });
  };

  const handleDeleteEquipo = (id) => {
    api
      .deleteEquipo(id)
      .then(() => {
        message.success("Equipo eliminado correctamente");
        cargarDatos();
      })
      .catch((err) => {
        message.error("Error al eliminar el equipo");
      });
  };

  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} md={8}>
        <Card
          title="Añadir Nuevo Club"
          size="small"
          className="cool-card card-equipo-form"
          style={{ marginBottom: 24 }}
          headStyle={{ color: "#ff4d4f" }}
        >
          <Form form={formClub} layout="vertical" onFinish={onFinishClub}>
            <Form.Item
              name="nombre"
              label="Nombre Club"
              rules={[
                {
                  required: true,
                  message: "Por favor, introduce el nombre del Club.",
                },
              ]}
            >
              <Input placeholder="Ej: FC Barcelona" />
            </Form.Item>
            <Form.Item
              name="contacto_nombre"
              label="Correo de Contacto"
              rules={[
                { required: true, message: "Por favor introduce un correo" },
                {
                  type: "email",
                  message:
                    "Por favor introduce un correo válido (ejemplo@mail.com)",
                },
              ]}
            >
              <Input placeholder="ejemplo@correo.com" />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              className="btn-equipo"
            >
              Crear Club
            </Button>
          </Form>
        </Card>

        <Card
          title="Añadir Categoría (Equipo)"
          size="small"
          className="cool-card card-equipo-form"
          headStyle={{ color: "#ff4d4f" }}
        >
          <Form form={formEquipo} layout="vertical" onFinish={onFinishEquipo}>
            <Form.Item
              name="club_id"
              label="Club"
              rules={[
                { required: true, message: "Por favor, selecciona un club." },
              ]}
            >
              <Select placeholder="Seleccionar club">
                {clubes.map((club) => (
                  <Option key={club.id} value={club.id}>
                    {club.nombre}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="categoria"
              label="Categoría"
              rules={[
                {
                  required: true,
                  message: "Por favor, introduce la categoría.",
                },
              ]}
            >
              <Input placeholder="Ej: U12, Femenino" />
            </Form.Item>
            <Form.Item
              name="fechas_estancia"
              label="Check-in / Check-out"
              rules={[{ required: true, message: "¡Falta la fecha!" }]}
            >
              <RangePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="num_jugadores"
              label="Nº Jugadores"
              rules={[
                {
                  required: true,
                  message: "Por favor, introduce el número de jugadores.",
                },
              ]}
            >
              <Input type="number" />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              className="btn-equipo"
            >
              Añadir Equipo
            </Button>
          </Form>
        </Card>
      </Col>

      <Col xs={24} md={16}>
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          {clubes.map((club) => (
            <Card
              key={club.id}
              hoverable
              className="cool-card card-equipo"
              bodyStyle={{ padding: "16px 24px" }}
            >
              {/*外层：俱乐部信息 & 垃圾桶图标*/}
              <Row justify="space-between" align="middle">
                <Col>
                  <Title level={5} style={{ margin: 0, color: "#ff4d4f" }}>
                    {club.nombre}
                  </Title>
                  <Text type="secondary" size="small">
                    Contacto: {club.contacto_nombre}
                  </Text>
                </Col>

                {/* 俱乐部的垃圾桶删除按钮 */}
                <Col>
                  <Tooltip title="Eliminar club">
                    <Popconfirm
                      title="¿Eliminar este club?"
                      description="Se borrarán también todos sus equipos. Esta acción no se puede deshacer."
                      onConfirm={() => handleDeleteClub(club.id)}
                      okText="Sí, eliminar"
                      cancelText="Cancelar"
                      okButtonProps={{ danger: true }}
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

              {/*内层：队伍列表 & 红色叉叉*/}
              <Text
                strong
                style={{ fontSize: "12px", display: "block", marginBottom: 8 }}
              >
                EQUIPOS INSCRITOS:
              </Text>
              <Space wrap>
                {equipos.filter((eq) => eq.club_id === club.id).length === 0 ? (
                  <Text type="secondary" italic>
                    Sin equipos registrados.
                  </Text>
                ) : (
                  equipos
                    .filter((eq) => eq.club_id === club.id)
                    .map((equipo) => {
                      // 队伍的总人数
                      const totalPersonas =
                        (equipo.num_jugadores || 0) +
                        (equipo.num_entrenadores || 0) +
                        (equipo.num_acompanantes || 0);

                      return (
                        <Card
                          key={equipo.id}
                          size="small"
                          style={{
                            marginBottom: 12, // 卡片间距
                            width: "100%",
                            borderRadius: "8px",
                          }}
                          bodyStyle={{
                            padding: "12px",
                            backgroundColor: "#f9f9f9",
                          }}
                        >
                          <Row justify="space-between" align="top">
                            {/* 左侧：类别和日期 */}
                            <Col flex="auto">
                              <Text
                                strong
                                style={{
                                  fontSize: "14px",
                                  display: "block",
                                  marginBottom: 8,
                                }}
                              >
                                {equipo.categoria}
                              </Text>

                              {/* 日期卡片区域 */}
                              {equipo.fecha_check_in && (
                                <Space
                                  size={4}
                                  style={{ display: "flex", flexWrap: "wrap" }}
                                >
                                  <div className="mini-date-card checkin">
                                    <div className="mini-card-label">
                                      Checkin
                                    </div>
                                    <div className="mini-card-value">
                                      {dayjs(equipo.fecha_check_in).format(
                                        "MMMM DD",
                                      )}
                                    </div>
                                  </div>
                                  <div className="mini-date-card checkout">
                                    <div className="mini-card-label">
                                      Checkout
                                    </div>
                                    <div className="mini-card-value">
                                      {dayjs(equipo.fecha_check_out).format(
                                        "MMMM DD",
                                      )}
                                    </div>
                                  </div>
                                </Space>
                              )}
                            </Col>

                            {/* 右侧：人数标签和删除按钮 */}
                            <Col
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-end",
                                justifyContent: "space-between",
                              }}
                            >
                              <Tag
                                color="#f04f4f"
                                style={{
                                  marginRight: 0,
                                  marginBottom: 12,
                                  borderRadius: "4px",
                                  fontWeight: "bold",
                                  border: "none",
                                }}
                              >
                                {totalPersonas} PERSONAS
                              </Tag>
                              <Popconfirm
                                title="¿Eliminar este equipo?"
                                onConfirm={() => handleDeleteEquipo(equipo.id)}
                                okText="Sí"
                                cancelText="No"
                              >
                                <Button
                                  type="text"
                                  danger
                                  size="small"
                                  icon={
                                    <CloseOutlined
                                      style={{ fontSize: "12px" }}
                                    />
                                  }
                                />
                              </Popconfirm>
                            </Col>
                          </Row>
                        </Card>
                      );
                    })
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
