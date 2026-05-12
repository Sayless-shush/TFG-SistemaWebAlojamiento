import React, { useState, useEffect } from "react";
import {
  Card,
  Checkbox,
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
  Radio,
} from "antd";
import {
  FilterOutlined,
  DeleteOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import api from "../services/api";
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Equipos = () => {
  const [clubes, setClubes] = useState([]);
  const [hoteles, setHoteles] = useState([]);
  const [filtros, setFiltros] = useState({
    categorias: [], // multiples categorias
    tieneBus: null, // true es si bus, false es no bus, null es sin filtro
  });
  const [equipos, setEquipos] = useState([]);
  const [formClub] = Form.useForm();
  const [formEquipo] = Form.useForm();

  const cargarDatos = () => {
    api.getClubes().then((datos) => setClubes(datos));
    api.getEquipos().then((datos) => setEquipos(datos));
    api.getHoteles().then((datos) => setHoteles(datos));
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const alEnviarClub = (valores) => {
    const datosClub = {
      ...valores,
      tiene_bus: valores.tiene_bus || false,
    };
    api.saveClub(datosClub).then(() => {
      message.success("Club creado correctamente");
      formClub.resetFields();
      cargarDatos();
    });
  };

  const alEnviarEquipo = (valores) => {
    const [inicio, fin] = valores.fechas_estancia || [];

    const datosEquipo = {
      ...valores,
      num_entrenadores: valores.num_entrenadores || 0,
      num_acompanantes: valores.num_acompanantes || 0,
      fecha_check_in: inicio ? inicio.format("YYYY-MM-DD") : null,
      fecha_check_out: fin ? fin.format("YYYY-MM-DD") : null,
      tipologia: valores.tipologia || null,
    };
    delete datosEquipo.fechas_estancia;

    api
      .saveEquipo(datosEquipo)
      .then(() => {
        message.success("Equipo añadido al club");
        formEquipo.resetFields();
        cargarDatos();
      })
      .catch((error) => {
        console.error("Error al guardar:", error);
        message.error("Error al conectar con el servidor.");
      });
  };

  const manejarEliminacionClub = (id) => {
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

  const manejarEliminacionEquipo = (id) => {
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

  // todas las categorías únicas para el filtro de categorías
  const categoriasUnicas = [...new Set(equipos.map((eq) => eq.categoria))];
  // todas los comerciales únicos para el filtro de comerciales, filtrando los vacíos
  const comercialesUnicos = [
    ...new Set(clubes.map((c) => c.comercial).filter(Boolean)),
  ];

  // filtrar equipos primero por categoría,luego clubs basandose de los equipos
  const equiposFiltrados = equipos.filter((equipo) => {
    if (
      filtros.categorias.length > 0 &&
      !filtros.categorias.includes(equipo.categoria)
    )
      return false; //ocultar si no esta
    return true;
  });

  // filtrar clubes basándose en los equipos filtrados y bus servicio
  const clubesFiltrados = clubes.filter((club) => {
    // si no conincide con el servicio de bus, ocultar
    if (
      filtros.tieneBus !== null &&
      club.tiene_bus !== (filtros.tieneBus === true ? 1 : 0)
    )
      return false;
    // si no conincide con el comercial, ocultar
    if (filtros.comercial && club.comercial !== filtros.comercial) return false;

    // los clubs que no tienen equipos filtrado elegido, ocultar
    const hayFiltroCategoria = filtros.categorias.length > 0;
    const tieneEquiposValidos = equiposFiltrados.some(
      (eq) => eq.club_id === club.id,
    );
    if (hayFiltroCategoria && !tieneEquiposValidos) return false;

    return true;
  });

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
          <Form form={formClub} layout="vertical" onFinish={alEnviarClub}>
            <Form.Item
              name="nombre"
              label="Nombre Club"
              rules={[{ required: true, message: "Obligatorio" }]}
            >
              <Input placeholder="Ej: FC Barcelona" />
            </Form.Item>
            <Form.Item
              name="categoria_pagada"
              label="Categoría de Hotel Pagada"
              rules={[{ required: true, message: "Seleccione la categoría" }]}
            >
              <Select placeholder="Selecciona la categoría">
                <Option value="3 estrellas">3 estrellas</Option>
                <Option value="4 estrellas">4 estrellas</Option>
                <Option value="Resort">Resort</Option>
              </Select>
            </Form.Item>
            <Form.Item name="contacto_nombre" label="Nombre de Contacto">
              <Input placeholder="Ej: Juan Pérez" />
            </Form.Item>
            <Form.Item name="contacto_telefono" label="Teléfono">
              <Input placeholder="Ej: +34 600 000 000" />
            </Form.Item>
            <Form.Item name="contacto_email" label="Correo Electrónico">
              <Input type="email" placeholder="ejemplo@correo.com" />
            </Form.Item>
            <Form.Item
              name="comercial"
              label="Comercial Asignado"
              rules={[
                { required: true, message: "Debes asignar un comercial" },
              ]}
            >
              <Select placeholder="Selecciona un comercial" allowClear>
                <Option value="SIN PATROCINIO">SIN PATROCINIO</Option>
                <Option value="Aitor Moreda">Aitor Moreda</Option>
                <Option value="Juan López">Juan López</Option>
                <Option value="Jesus López">Jesus López</Option>
                <Option value="FTI Carolina">FTI Carolina</Option>
                <Option value="Nestor García">Nestor García</Option>
                <Option value="Nando">Nando</Option>
                <Option value="Darren DBSports">Darren DBSports</Option>
                <Option value="Rory TW Soccer">Rory TW Soccer</Option>
                <Option value="OnSports">OnSports</Option>
                <Option value="Vigfús Geir (TA Sport Travel)">
                  Vigfús Geir (TA Sport Travel)
                </Option>
                <Option value="Tommy Carter">Tommy Carter</Option>
                <Option value="MHL">MHL</Option>
                <Option value="Hommikukuma">Hommikukuma</Option>
                <Option value="Adrià Miró / Jan Esteller">
                  Adrià Miró / Jan Esteller
                </Option>
                <Option value="Alain Morange">Alain Morange</Option>
                <Option value="Rafa Navarro">Rafa Navarro</Option>
                <Option value="Aitor Orive / Gonzalo">
                  Aitor Orive / Gonzalo
                </Option>
                <Option value="Sergi Ferrer">Sergi Ferrer</Option>
                <Option value="Tommy Carter">Tommy Carter</Option>
                <Option value="Jori Aguilar">Jori Aguilar</Option>
                <Option value="Toño Guiu">Toño Guiu</Option>
                <Option value="Secun">Secun</Option>
                <Option value="Ibertravel">Ibertravel</Option>
                <Option value="YoungTalentsGroup">YoungTalentsGroup</Option>
                <Option value="Jaume Canals">Jaume Canals</Option>
                <Option value="Pilar DeporteYTorneos.com">
                  Pilar DeporteYTorneos.com
                </Option>
                <Option value="Marcial">Marcial</Option>
              </Select>
            </Form.Item>
            <Form.Item name="tiene_bus" valuePropName="checked">
              <Checkbox>Tiene servicio de Bus 🚌</Checkbox>
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              className="btn-equipo"
            >
              Guardar Club
            </Button>
          </Form>
        </Card>

        <Card
          title="Añadir Categoría (Equipo)"
          size="small"
          className="cool-card card-equipo-form"
          headStyle={{ color: "#ff4d4f" }}
        >
          <Form form={formEquipo} layout="vertical" onFinish={alEnviarEquipo}>
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
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  name="categoria"
                  label="Categoría(sin espacio)"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Ej: U12" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="tipologia" label="Tipología (opcional)">
                  <Input placeholder="Ej: Entrenador" />
                </Form.Item>
              </Col>
            </Row>
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
              rules={[{ required: true }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              name="tipo_habitacion_deseada"
              label="Habitación Preferida"
              rules={[
                { required: true, message: "Obligatorio para la asignación" },
              ]}
            >
              <Select placeholder="Selecciona el tipo de habitación preferida">
                <Option value="1Persona">1 Persona</Option>
                <Option value="Doble">Doble</Option>
                <Option value="Triple">Triple</Option>
                <Option value="Cuádruple">Cuádruple</Option>
              </Select>
            </Form.Item>
            <Form.Item name="observaciones" label="Observaciones (Opcional)">
              <Input.TextArea
                rows={2}
                placeholder="Alergias, peticiones especiales..."
              />
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
        <Card
          size="small"
          style={{
            marginBottom: 16,
            borderRadius: "8px",
            background: "#f0f2f5",
            border: "1px solid #d9d9d9",
          }}
        >
          {/* Filtos categoria */}
          <Row align="middle" gutter={16}>
            <Col>
              <FilterOutlined style={{ fontSize: "16px", color: "#1890ff" }} />{" "}
              <Text strong>Filtros:</Text>
            </Col>
            <Col flex="auto">
              <Select
                mode="multiple"
                allowClear
                style={{ width: "100%", minWidth: "200px" }}
                placeholder="Filtrar por Categoría (Ej: U11, U12)"
                value={filtros.categorias}
                onChange={(vals) =>
                  setFiltros({ ...filtros, categorias: vals })
                }
              >
                {categoriasUnicas.map((cat) => (
                  <Option key={cat} value={cat}>
                    {cat}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col style={{ width: 200 }}>
              {/* Filtos Comercial */}
              <Select
                allowClear
                placeholder="Por Comercial"
                style={{ width: "100%" }}
                onChange={(val) => setFiltros({ ...filtros, comercial: val })}
              >
                {comercialesUnicos.map((c) => (
                  <Option key={c} value={c}>
                    {c}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col>
              {/* Filtos bus */}
              <Radio.Group
                value={filtros.tieneBus}
                onChange={(e) =>
                  setFiltros({ ...filtros, tieneBus: e.target.value })
                }
                buttonStyle="solid"
              >
                <Radio.Button value={null}>Todos</Radio.Button>
                <Radio.Button value={true}>🚌 Con Bus</Radio.Button>
                <Radio.Button value={false}>Sin Bus</Radio.Button>
              </Radio.Group>
            </Col>
          </Row>
        </Card>
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          {clubesFiltrados.map((club) => (
            <Card
              key={club.id}
              hoverable
              className="cool-card card-equipo"
              bodyStyle={{ padding: "16px 24px" }}
            >
              {/*info del club y eliminar*/}
              <Row justify="space-between" align="middle">
                <Col>
                  <Title level={5} style={{ margin: 0, color: "#ff4d4f" }}>
                    {club.nombre}
                    {club.tiene_bus === 1 && (
                      <Tag color="orange" style={{ marginLeft: 12 }}>
                        🚌 Servicio de Bus
                      </Tag>
                    )}
                  </Title>
                  <Text
                    type="secondary"
                    size="small"
                    style={{ display: "block" }}
                  >
                    👤 {club.contacto_nombre || "N/A"} | 📞{" "}
                    {club.contacto_telefono || "N/A"} | 📧{" "}
                    {club.contacto_email || "N/A"}
                  </Text>
                  {club.comercial && (
                    <Tag color="blue" style={{ marginTop: 4 }}>
                      Comercial: {club.comercial}
                    </Tag>
                  )}
                </Col>
                {/* Asig manual y eliminar del club */}
                <Col>
                  <div style={{ textAlign: "left" }}>
                    <Text
                      strong
                      style={{
                        fontSize: "11px",
                        display: "block",
                        marginBottom: "2px",
                        color: "#888",
                      }}
                    >
                      Asignar Hotel Manualmente (Opcional):
                    </Text>
                    <Select
                      placeholder="Seleccionar hotel..."
                      style={{ width: "200px" }}
                      allowClear
                      value={club.hotel_manual_id}
                      onChange={(valor) => {
                        api
                          .updateClubHotel(club.id, valor)
                          .then(() => {
                            message.success(
                              `Hotel manual actualizado para ${club.nombre}`,
                            );
                            cargarDatos();
                          });
                      }}
                    >
                      {hoteles.map((h) => (
                        <Option key={h.id} value={h.id}>
                          {h.nombre} ({h.categoria})
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <Tooltip title="Eliminar club">
                    <Popconfirm
                      title="¿Eliminar este club?"
                      description="Se borrarán también todos sus equipos. Esta acción no se puede deshacer."
                      onConfirm={() => manejarEliminacionClub(club.id)}
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

              {/*lista de equipos y eliminar*/}
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
                  equiposFiltrados
                    .filter((eq) => eq.club_id === club.id)
                    .map((equipo) => {
                      // total personas de equipo
                      const totalPersonas =
                        (equipo.num_jugadores || 0) +
                        (equipo.num_entrenadores || 0) +
                        (equipo.num_acompanantes || 0);

                      return (
                        <Card
                          key={equipo.id}
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
                            {/* fecha y categoria */}
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
                                {equipo.tipologia && (
                                  <Tag color="cyan" style={{ marginLeft: 8 }}>
                                    {equipo.tipologia}
                                  </Tag>
                                )}
                                {/* tipo de habitación */}
                                {equipo.tipo_habitacion_deseada && (
                                  <Tag color="purple" style={{ marginLeft: 8 }}>
                                    {equipo.tipo_habitacion_deseada}
                                  </Tag>
                                )}
                              </Text>
                              {equipo.fecha_check_in && (
                                <Space
                                  size={4}
                                  style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    marginBottom: 8,
                                  }}
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

                              {/* observaciones */}
                              {equipo.observaciones && (
                                <Text
                                  type="secondary"
                                  italic
                                  style={{
                                    fontSize: "11px",
                                    display: "block",
                                    background: "#eee",
                                    padding: "4px",
                                    borderRadius: "4px",
                                  }}
                                >
                                  📝 {equipo.observaciones}
                                </Text>
                              )}
                            </Col>

                            {/* numero de personas */}
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
                                onConfirm={() =>
                                  manejarEliminacionEquipo(equipo.id)
                                }
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
