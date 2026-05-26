const dayjs = require("dayjs");

// dayjs para la asignacion de habitaciones, especialmente para validar las fechas de
// disponibilidad de las habitaciones frente a las fechas de check-in/check-out de los equipos.
const isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
const isSameOrAfter = require("dayjs/plugin/isSameOrAfter");

// Extender dayjs con los plugins necesarios para las comparaciones de fechas en el algoritmo de asignación.
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
// funcion auxiliar para convertir el tipo de habitación a su capacidad
function obtenerCapacidad(tipo) {
  const t = tipo.toLowerCase();
  if (t.includes("doble")) return 2;
  if (t.includes("triple")) return 3;
  if (t.includes("cuádruple") || t.includes("cuadruple")) return 4;
  return 1;
}

//Motor de cálculo inteligente de habitaciones
function calcularDistribucionHabitaciones(equipo) {
  const totalPax =
    (equipo.num_jugadores || 0) +
    (equipo.num_entrenadores || 0) +
    (equipo.num_acompanantes || 0);
  const manualDobles = equipo.manual_dobles || 0;
  const manualIndiv = equipo.manual_individuales || 0;
  //Resta las personas que ya tienen habitación manual asignada
  let paxRestante = totalPax - manualDobles * 2 - manualIndiv * 1;
  if (paxRestante < 0) paxRestante = 0;

  let triples = 0;
  let cuadruples = 0;

  if (equipo.tipo_habitacion_deseada === "Cuádruple") {
    cuadruples = Math.ceil(paxRestante / 4);
  } else if (equipo.tipo_habitacion_deseada === "Triple") {
    const numTriples = Math.floor(paxRestante / 3);
    const resto = paxRestante % 3;

    if (resto === 0) {
      triples = numTriples;
    } else if (resto === 1 && numTriples > 0) {
      //Si sobra 1 persona, cambiamos una triple por una cuádruple
      triples = numTriples - 1;
      cuadruples = 1;
    } else {
      //Si sobran 2 personas (o 1 persona pero no hay triples previas), forzar una triple
      triples = numTriples + 1;
    }
  } else {
    cuadruples = Math.ceil(paxRestante / 4); // Fallback de seguridad
  }

  //Retorna un diccionario indexado por la "capacidad" de la habitación (1, 2, 3 o 4)
  return {
    1: manualIndiv,
    2: manualDobles,
    3: triples,
    4: cuadruples,
  };
}

exports.asignarAuto = (clubes, equipos, hoteles, habitaciones) => {
  let clubesNoAsignados = [];
  let asignaciones = [];

  // una copia del inventario de habitaciones para manipular durante el proceso de asignación sin afectar los datos originales,backtraccking
  let inventarioGlobal = JSON.parse(JSON.stringify(habitaciones));

  // preparar los datos de los clubes, calcular estadísticas clave y ordenar por prioridad
  let clubesConEstadisticas = clubes.map((club) => {
    let equiposDelClub = equipos.filter((e) => e.club_id === club.id);
    let totalPersonas = equiposDelClub.reduce(
      (suma, eq) =>
        suma +
        (eq.num_jugadores || 0) +
        (eq.num_entrenadores || 0) +
        (eq.num_acompanantes || 0),
      0,
    );
    return { ...club, equiposDelClub, totalPersonas };
  });

  clubesConEstadisticas.sort((a, b) => {
    if (a.tiene_bus && !b.tiene_bus) return -1;
    if (!a.tiene_bus && b.tiene_bus) return 1;
    return b.totalPersonas - a.totalPersonas;
  });

  for (let club of clubesConEstadisticas) {
    if (club.totalPersonas === 0) continue;
    let estaAsignado = false;

    let hotelesCandidatos = hoteles.filter((h) => {
      // Prioridad 1：Manual es supremo de todo
      if (club.hotel_manual_id) {
        return h.id === club.hotel_manual_id;
      }

      // Prioridad 2：Si el club necesita bus, el hotel debe ser cercano al bus
      if (club.tiene_bus && !h.cerca_autobus) return false;

      // Prioridad 3：Si el club tiene una categoría pagada, el hotel debe ser de esa categoría
      if (club.categoria_pagada && h.categoria !== club.categoria_pagada)
        return false;

      return true;
    });

    hotelesCandidatos.sort((a, b) => {
      const clasificacion = {
        "5 estrellas": 5,
        "4 estrellas": 4,
        Resort: 4,
        "3 estrellas": 3,
        Apartamento: 2,
      };
      return (
        (clasificacion[b.categoria] || 0) - (clasificacion[a.categoria] || 0)
      );
    });

    for (let hotel of hotelesCandidatos) {
      let inventarioTemporal = JSON.parse(JSON.stringify(inventarioGlobal));
      let asignacionesTemporales = [];
      let hotelTieneCapacidadSuficiente = true;

      for (let eq of club.equiposDelClub) {
        //Obtener la distribución óptima calculada (Cuántas de 1, 2, 3 y 4 necesitamos)
        let demandaHabitaciones = calcularDistribucionHabitaciones(eq);
        let totalHabitacionesDemandadas =
          demandaHabitaciones[1] +
          demandaHabitaciones[2] +
          demandaHabitaciones[3] +
          demandaHabitaciones[4];

        if (totalHabitacionesDemandadas === 0) continue;

        let fechaEntrada = dayjs(eq.fecha_check_in);
        let fechaSalida = dayjs(eq.fecha_check_out);

        // Filtrar habitaciones disponibles en este hotel para estas fechas
        let habitacionesValidas = inventarioTemporal.filter((r) => {
          if (r.hotel_id !== hotel.id || r.cantidad_total <= 0) return false;
          let fechaInicioHabitacion = dayjs(r.disponible_desde);
          let fechaFinHabitacion = dayjs(r.disponible_hasta);
          return (
            fechaInicioHabitacion.isSameOrBefore(fechaEntrada) &&
            fechaFinHabitacion.isSameOrAfter(fechaSalida)
          );
        });

        let habitacionesAsignadasEquipo = [];
        let equipoAsignadoCompletamente = true;

        //Intentar satisfacer la demanda exacta procesando cada capacidad (1 individual, 2 doble, etc.)
        for (let cap of [1, 2, 3, 4]) {
          let cantidadNecesaria = demandaHabitaciones[cap];
          if (cantidadNecesaria <= 0) continue;

          //buscar coincidencia exacta de capacidad
          for (let habitacion of habitacionesValidas) {
            if (cantidadNecesaria <= 0) break;
            if (habitacion.capacidad === cap && habitacion.cantidad_total > 0) {
              let tomar = Math.min(
                cantidadNecesaria,
                habitacion.cantidad_total,
              );
              habitacion.cantidad_total -= tomar;
              cantidadNecesaria -= tomar;

              habitacionesAsignadasEquipo.push({
                habitacion_id: habitacion.id,
                tipo: habitacion.tipo,
                capacidad: habitacion.capacidad,
                cantidad_asignada: tomar,
              });
            }
          }

          // B)Fallback inteligente: Si no hay exactas, usar una habitación MÁS GRANDE (Upgrade)
          if (cantidadNecesaria > 0) {
            for (let habitacion of habitacionesValidas) {
              if (cantidadNecesaria <= 0) break;
              if (habitacion.capacidad > cap && habitacion.cantidad_total > 0) {
                let tomar = Math.min(
                  cantidadNecesaria,
                  habitacion.cantidad_total,
                );
                habitacion.cantidad_total -= tomar;
                cantidadNecesaria -= tomar;

                habitacionesAsignadasEquipo.push({
                  habitacion_id: habitacion.id,
                  tipo: habitacion.tipo,
                  capacidad: habitacion.capacidad,
                  cantidad_asignada: tomar,
                });
              }
            }
          }

          // Si aun con el fallback no conseguimos cubrir esta capacidad, el hotel falla
          if (cantidadNecesaria > 0) {
            equipoAsignadoCompletamente = false;
            break;
          }
        }

        //Evaluar resultado final del equipo
        if (!equipoAsignadoCompletamente) {
          hotelTieneCapacidadSuficiente = false;
          break; // Corta el bucle de equipos, este hotel no sirve para el club
        } else {
          asignacionesTemporales.push({
            equipo_id: eq.id,
            categoria: eq.categoria,
            tipologia: eq.tipologia,
            habitaciones: habitacionesAsignadasEquipo,
          });
        }
      }

      if (hotelTieneCapacidadSuficiente) {
        inventarioGlobal = inventarioTemporal;
        asignaciones.push({
          club_id: club.id,
          club_nombre: club.nombre,
          hotel_id: hotel.id,
          hotel_nombre: hotel.nombre,
          hotel_categoria: hotel.categoria,
          equipos_asignados: asignacionesTemporales,
        });
        estaAsignado = true;
        break; // salir del bucle de hoteles candidatos, este club ya tiene asignación
      }
      // si no encaja, el ciclo continúa con el siguiente hotel candidato,
      // sin necesidad de hacer nada extra porque el inventarioTemporal se descarta al salir del bloque.
      // Esto es clave para implementar el backtracking de manera limpia: cada iteración de hotel
      // parte de una copia fresca del inventario, y solo si se confirma la asignación se actualiza
      // el inventario global. Si no se confirma, simplemente se deja que inventarioTemporal sea recolectado
      // por el garbage collector, sin afectar el estado global ni requerir pasos manuales de "rollback".
    }

    // si después de probar todos los hoteles candidatos no se pudo asignar el club,
    // se agrega a la lista de no asignados con el motivo correspondiente
    if (!estaAsignado) {
      clubesNoAsignados.push({
        club_id: club.id,
        club_nombre: club.nombre,
        motivo:
          "No se encontró hotel que cumpla todos los requisitos (fechas, capacidad o bus).",
        equipos_pendientes: club.equiposDelClub,
      });
    }
  }

  return {
    exito: true,
    datos: asignaciones,
    noAsignados: clubesNoAsignados,
    inventarioRestante: inventarioGlobal,
  };
};
