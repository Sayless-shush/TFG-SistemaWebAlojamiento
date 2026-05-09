const dayjs = require('dayjs');

// dayjs para la asignacion de habitaciones, especialmente para validar las fechas de 
// disponibilidad de las habitaciones frente a las fechas de check-in/check-out de los equipos.
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');

// Extender dayjs con los plugins necesarios para las comparaciones de fechas en el algoritmo de asignación.
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
// funcion auxiliar para convertir el tipo de habitación a su capacidad
function obtenerCapacidad(tipo) {
    const t = tipo.toLowerCase();
    if (t.includes('doble')) return 2;
    if (t.includes('triple')) return 3;
    if (t.includes('cuádruple') || t.includes('cuadruple')) return 4;
    return 1; 
}

exports.asignarAuto = (clubes, equipos, hoteles, habitaciones) => {
    let clubesNoAsignados = [];
    let asignaciones = [];
    
    // una copia del inventario de habitaciones para manipular durante el proceso de asignación sin afectar los datos originales,backtraccking
    let inventarioGlobal = JSON.parse(JSON.stringify(habitaciones));

    // preparar los datos de los clubes, calcular estadísticas clave y ordenar por prioridad
    let clubesConEstadisticas = clubes.map(club => {
        let equiposDelClub = equipos.filter(e => e.club_id === club.id);
        let totalPersonas = equiposDelClub.reduce((suma, eq) => suma + (eq.num_jugadores || 0) + (eq.num_entrenadores || 0) + (eq.num_acompanantes || 0), 0);
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

        let hotelesCandidatos = hoteles.filter(h => {
            if (club.tiene_bus && !h.cerca_autobus) return false;

            let habitacionesHotel = inventarioGlobal.filter(r => r.hotel_id === h.id);
            let capacidadTotalHotel = habitacionesHotel.reduce((suma, r) => suma + (r.capacidad * r.cantidad_total), 0);
            if (capacidadTotalHotel < club.totalPersonas) return false;

            return true;
        });

        hotelesCandidatos.sort((a, b) => {
            const clasificacion = { "5 estrellas": 5, "4 estrellas": 4, "Resort": 4, "3 estrellas": 3, "Apartamento": 2 };
            return (clasificacion[b.categoria] || 0) - (clasificacion[a.categoria] || 0);
        });

        for (let hotel of hotelesCandidatos) {
            let inventarioTemporal = JSON.parse(JSON.stringify(inventarioGlobal));
            let asignacionesTemporales = [];
            let hotelTieneCapacidadSuficiente = true; 

            for (let eq of club.equiposDelClub) {
                let personasRestantes = (eq.num_jugadores || 0) + (eq.num_entrenadores || 0) + (eq.num_acompanantes || 0);
                if (personasRestantes === 0) continue;

                let fechaEntrada = dayjs(eq.fecha_check_in);
                let fechaSalida = dayjs(eq.fecha_check_out);

                let habitacionesValidas = inventarioTemporal.filter(r => {
                    if (r.hotel_id !== hotel.id || r.cantidad_total <= 0) return false;
                    let fechaInicioHabitacion = dayjs(r.disponible_desde);
                    let fechaFinHabitacion = dayjs(r.disponible_hasta);
                    return fechaInicioHabitacion.isSameOrBefore(fechaEntrada) && fechaFinHabitacion.isSameOrAfter(fechaSalida);
                });

                habitacionesValidas.sort((a, b) => {
                    let prefA = a.tipo === eq.tipo_habitacion_deseada ? 1 : 0;
                    let prefB = b.tipo === eq.tipo_habitacion_deseada ? 1 : 0;
                    if (prefA !== prefB) return prefB - prefA; 
                    return b.capacidad - a.capacidad; 
                });

                let habitacionesAsignadasEquipo = [];
                
                for (let habitacion of habitacionesValidas) {
                    if (personasRestantes <= 0) break;
                    if (habitacion.cantidad_total > 0) {
                        let habitacionesNecesarias = Math.ceil(personasRestantes / habitacion.capacidad);
                        let habitacionesATomar = Math.min(habitacionesNecesarias, habitacion.cantidad_total); 
                        
                        habitacion.cantidad_total -= habitacionesATomar;
                        personasRestantes -= habitacionesATomar * habitacion.capacidad;

                        habitacionesAsignadasEquipo.push({
                            habitacion_id: habitacion.id,
                            tipo: habitacion.tipo,
                            capacidad: habitacion.capacidad,
                            cantidad_asignada: habitacionesATomar
                        });
                    }
                }

                if (personasRestantes > 0) {
                    hotelTieneCapacidadSuficiente = false;
                    break; 
                } else {
                    asignacionesTemporales.push({
                        equipo_id: eq.id,
                        categoria: eq.categoria,
                        tipologia: eq.tipologia,
                        habitaciones: habitacionesAsignadasEquipo
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
                    equipos_asignados: asignacionesTemporales
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
                motivo: "No se encontró hotel que cumpla todos los requisitos (fechas, capacidad o bus).",
                equipos_pendientes: club.equiposDelClub
            });
        }
    }

    return {
        exito: true,
        datos: asignaciones,
        noAsignados: clubesNoAsignados,
        inventarioRestante: inventarioGlobal
    };
};