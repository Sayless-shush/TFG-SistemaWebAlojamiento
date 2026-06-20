import React, { useState } from "react";
import {
  Card,
  Button,
  Typography,
  Row,
  Col,
  Spin,
  Empty,
  message,
  Tag,
  Alert,
  Divider,
  Space,
  Select,
} from "antd";
import {
  RocketOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import api from "../services/api";

const { Title, Text } = Typography;
const { Option } = Select;

const Asignacion = () => {
  const [cargando, setCargando] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState(null);

  // localstore para persistir el último resultado de asignación, incluso al recargar la página
  const [resultado, setResultado] = useState(() => {
    const dataGuardada = localStorage.getItem("ultimoResultadoAsignacion");
    return dataGuardada ? JSON.parse(dataGuardada) : null;
  });

  const manejarEjecucion = () => {
    setCargando(true);
    message.loading({
      content: "Calculando la mejor distribución...",
      key: "asignacion",
    });

    api
      .runAsignacion()
      .then((res) => {
        setResultado(res);
        localStorage.setItem("ultimoResultadoAsignacion", JSON.stringify(res));
        message.success({
          content: "¡Asignación completada con éxito!",
          key: "asignacion",
          duration: 3,
        });
      })
      .catch((error) => {
        console.error(error);
        message.error({
          content: "Error al ejecutar el algoritmo",
          key: "asignacion",
          duration: 3,
        });
      })
      .finally(() => {
        setCargando(false);
      });
  };

  // agrupar las asignaciones por hotel para facilitar la visualización,
  // y mostrar los restos habitaciones
  const agruparPorHotel = (asignaciones, inventarioRestante) => {
    if (!asignaciones) return {};
    const agrupado = {};

    // agrupar las asignaciones por hotel
    asignaciones.forEach((asig) => {
      const nombreHotel = asig.hotel_nombre;
      const idHotel = asig.hotel_id;
      if (!agrupado[nombreHotel]) {
        agrupado[nombreHotel] = {
          id: idHotel,
          categoria: asig.hotel_categoria,
          clubes: [],
          inventario: [],
        };
      }
      agrupado[nombreHotel].clubes.push(asig);
    });

    // habitaciones restantes
    if (inventarioRestante) {
      Object.keys(agrupado).forEach((nombreHotel) => {
        const idH = agrupado[nombreHotel].id;
        agrupado[nombreHotel].inventario = inventarioRestante.filter(
          (r) => r.hotel_id === idH && r.cantidad_total > 0,
        );
      });
    }

    return agrupado;
  };

  const calcularHabitacionesNecesarias = (personas, tipoDeseado) => {
    if (!tipoDeseado || personas <= 0) return 0;
    const tipo = tipoDeseado.toLowerCase();
    let capacidad = 1;
    if (tipo.includes("doble")) capacidad = 2;
    if (tipo.includes("triple")) capacidad = 3;
    if (tipo.includes("cuádruple") || tipo.includes("cuadruple")) capacidad = 4;
    return Math.ceil(personas / capacidad);
  };

  const hotelesAgrupados = resultado
    ? agruparPorHotel(resultado.datos, resultado.inventarioRestante)
    : {};

  const hotelesMostrar = Object.entries(hotelesAgrupados).filter(
    ([nombre, datos]) => {
      if (!filtroCategoria) return true;
      return datos.categoria === filtroCategoria;
    },
  );

  return (
    <div style={{ padding: "0px" }}>
      {/*panel de arriba*/}
      <Card
        style={{
          marginBottom: 24,
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
        bodyStyle={{ padding: "24px" }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0, color: "#1677ff" }}>
              Asignación Automática
            </Title>
            <Text type="secondary">
              Ejecuta el algoritmo para distribuir a los clubes en los hoteles.
            </Text>
          </Col>

          <Col>
            <Button
              type="primary"
              size="large"
              icon={<RocketOutlined />}
              onClick={manejarEjecucion}
              loading={cargando}
              style={{
                backgroundColor: "#722ed1",
                borderColor: "#722ed1",
                borderRadius: "8px",
              }}
            >
              {cargando ? "Calculando..." : "Ejecutar Asignación"}
            </Button>
          </Col>
        </Row>
      </Card>

      {/*resultados*/}
      <Spin
        spinning={cargando}
        tip="Procesando restricciones (Bus, Fechas, Capacidad)..."
      >
        {!resultado && !cargando && (
          <Card
            style={{
              borderRadius: "8px",
              minHeight: "400px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Empty
              description={
                <Text type="secondary" style={{ fontSize: "16px" }}>
                  Aún no se ha ejecutado ninguna asignación hoy.
                </Text>
              }
            />
          </Card>
        )}

        {resultado && (
          <div>
            {/*estadísticas*/}
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col xs={24} md={12}>
                <Alert
                  message={<Text strong>Asignaciones Exitosas</Text>}
                  description={`Se han ocupado ${Object.keys(hotelesAgrupados).length} hoteles con ${resultado.datos?.length || 0} clubes.`}
                  type="success"
                  showIcon
                  icon={<CheckCircleOutlined />}
                  style={{ borderRadius: "8px" }}
                />
              </Col>
              <Col xs={24} md={12}>
                {resultado.noAsignados?.length > 0 ? (
                  <Alert
                    message={
                      <Text strong style={{ color: "#cf1322" }}>
                        Clubes Sin Asignar ({resultado.noAsignados.length})
                      </Text>
                    }
                    description="Estos clubes no pudieron ser asignados (Falta de camas, bus, o fechas)."
                    type="error"
                    showIcon
                    icon={<WarningOutlined />}
                    style={{ borderRadius: "8px" }}
                  />
                ) : (
                  <Alert
                    message={<Text strong>Asignación Perfecta</Text>}
                    description="Todos los clubes han sido asignados correctamente a un hotel."
                    type="info"
                    showIcon
                    style={{ borderRadius: "8px" }}
                  />
                )}
              </Col>
            </Row>

            {/*fallidos*/}
            {resultado.noAsignados?.length > 0 && (
              <Card
                title="⚠️ Requieren Revisión Manual"
                headStyle={{ color: "#cf1322", backgroundColor: "#fff1f0" }}
                style={{
                  marginBottom: 24,
                  borderRadius: "8px",
                  borderColor: "#ffa39e",
                }}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  {resultado.noAsignados.map((clubNoAsignado, indice) => (
                    <div
                      key={indice}
                      style={{
                        padding: "16px",
                        background: "#fff",
                        border: "1px solid #ffccc7",
                        borderRadius: "8px",
                      }}
                    >
                      <div style={{ marginBottom: "12px" }}>
                        <Text
                          strong
                          style={{ fontSize: "16px", color: "#cf1322" }}
                        >
                          🚨 {clubNoAsignado.club_nombre}
                        </Text>
                        <Text type="secondary" style={{ marginLeft: "8px" }}>
                          - {clubNoAsignado.motivo}
                        </Text>
                      </div>
                      {clubNoAsignado.equipos_pendientes && (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                            paddingLeft: "10px",
                          }}
                        >
                          {clubNoAsignado.equipos_pendientes.map((equipo) => {
                            const totalPersonas =
                              (equipo.num_jugadores || 0) +
                              (equipo.num_entrenadores || 0) +
                              (equipo.num_acompanantes || 0);
                            const habitacionesNecesarias =
                              calcularHabitacionesNecesarias(
                                totalPersonas,
                                equipo.tipo_habitacion_deseada,
                              );

                            return totalPersonas > 0 ? (
                              <div
                                key={equipo.id}
                                style={{
                                  background: "#fff1f0",
                                  padding: "10px 12px",
                                  borderRadius: "6px",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  border: "1px dashed #ffa39e",
                                }}
                              >
                                <div>
                                  <Text strong>{equipo.categoria}</Text>
                                  <Text
                                    type="secondary"
                                    style={{ marginLeft: "8px" }}
                                  >
                                    | {totalPersonas} personas
                                  </Text>
                                </div>
                                <div>
                                  <Text
                                    type="danger"
                                    strong
                                    style={{ marginRight: "8px" }}
                                  >
                                    Necesitan:
                                  </Text>
                                  <Tag color="red" style={{ margin: 0 }}>
                                    {habitacionesNecesarias}x{" "}
                                    {equipo.tipo_habitacion_deseada}
                                  </Tag>
                                </div>
                              </div>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </Space>
              </Card>
            )}

            {/*exitosos*/}
            <Title level={4} style={{ marginBottom: 16 }}>
              🏨 Distribución por Hotel
            </Title>
            <Select
              allowClear
              placeholder="Filtrar por Categoría de Hotel"
              style={{ width: 250 }}
              onChange={setFiltroCategoria}
              value={filtroCategoria}
            >
              <Option value={null}>Todo</Option>
              <Option value="4 estrellas">4 estrellas</Option>
              <Option value="3 estrellas">3 estrellas</Option>
              <Option value="Resort">Resort</Option>
            </Select>
            <Row gutter={[16, 16]}>
              {hotelesMostrar.map(([nombreHotel, datosHotel]) => (
                <Col xs={24} lg={12} key={nombreHotel}>
                  <Card
                    title={
                      <span
                        style={{
                          color: "#1677ff",
                          fontSize: "16px",
                          fontWeight: "bold",
                        }}
                      >
                        {nombreHotel}
                      </span>
                    }
                    extra={
                      <Tag color="blue">
                        {datosHotel.clubes.length} Club(es)
                      </Tag>
                    }
                    style={{
                      borderRadius: "8px",
                      height: "100%",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                    headStyle={{
                      backgroundColor: "#e6f4ff",
                      borderBottom: "1px solid #91caff",
                    }}
                  >
                    {/*equipos asignados*/}
                    <Space
                      direction="vertical"
                      style={{ width: "100%" }}
                      size="large"
                    >
                      {datosHotel.clubes.map((club) => (
                        <div key={club.club_id}>
                          <Text
                            strong
                            style={{ fontSize: "15px", color: "#ff4d4f" }}
                          >
                            🛡️ {club.club_nombre}
                          </Text>
                          <div
                            style={{
                              marginTop: "10px",
                              display: "flex",
                              flexDirection: "column",
                              gap: "8px",
                              paddingLeft: "10px",
                            }}
                          >
                            {club.equipos_asignados.map((equipo) => (
                              <div
                                key={equipo.equipo_id}
                                style={{
                                  background: "#fafafa",
                                  padding: "10px 12px",
                                  borderRadius: "6px",
                                  border: "1px solid #d9d9d9",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <div>
                                  <Text strong>{equipo.categoria}</Text>
                                  {equipo.tipologia && (
                                    <Text
                                      type="secondary"
                                      style={{ marginLeft: "6px" }}
                                    >
                                      ({equipo.tipologia})
                                    </Text>
                                  )}
                                </div>
                                <div>
                                  {equipo.habitaciones.map((hab, indice) => (
                                    <Tag
                                      color={hab.es_upgrade ? "purple" : "cyan"} // Upgrade es morado
                                      key={indice}
                                      style={{
                                        margin: "0 0 0 6px",
                                        fontSize: "13px",
                                        padding: "4px 8px",
                                        borderRadius: "4px",
                                      }}
                                    >
                                      {hab.cantidad_asignada}x{" "}
                                      {hab.tipo_solicitado ||
                                        hab.tipo_asignado ||
                                        hab.tipo}
                                      {/* UPGRADE */}
                                      {hab.es_upgrade && (
                                        <span
                                          style={{
                                            fontSize: "11px",
                                            opacity: 0.85,
                                            marginLeft: "4px",
                                          }}
                                        >
                                          (en {hab.tipo_asignado})
                                        </span>
                                      )}
                                    </Tag>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </Space>

                    <Divider
                      dashed
                      style={{
                        margin: "20px 0 16px 0",
                        borderColor: "#d9d9d9",
                      }}
                    />

                    {/*habitaciones restantes*/}
                    <div>
                      <Text
                        type="secondary"
                        strong
                        style={{ display: "block", marginBottom: "10px" }}
                      >
                        🛏️ Habitaciones Disponibles (Sin asignar):
                      </Text>
                      {datosHotel.inventario.length > 0 ? (
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "8px",
                          }}
                        >
                          {datosHotel.inventario.map((inv, indice) => (
                            <Tag
                              color="green"
                              key={indice}
                              style={{
                                fontSize: "13px",
                                padding: "4px 10px",
                                borderRadius: "4px",
                                border: "1px solid #b7eb8f",
                                margin: 0,
                              }}
                            >
                              {inv.cantidad_total}x {inv.tipo}
                            </Tag>
                          ))}
                        </div>
                      ) : (
                        <Text
                          type="danger"
                          style={{ fontSize: "13px", fontWeight: "bold" }}
                        >
                          ¡Hotel Completo! (0 habitaciones libres)
                        </Text>
                      )}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Spin>
    </div>
  );
};

export default Asignacion;
