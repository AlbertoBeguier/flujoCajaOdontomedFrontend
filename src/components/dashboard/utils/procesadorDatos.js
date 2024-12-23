export const procesarIngresosPorDia = (ingresos = [], dias = 7) => {
  try {
    // Obtener fecha actual y fecha límite
    const fechaActual = new Date();
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - (dias - 1));
    fechaLimite.setHours(0, 0, 0, 0);

    // Generar array de todas las fechas en el rango
    const todasLasFechas = [];
    for (let d = 0; d < dias; d++) {
      const fecha = new Date(fechaActual);
      fecha.setDate(fecha.getDate() - d);
      todasLasFechas.unshift(fecha.toLocaleDateString("es-AR"));
    }

    // Procesar ingresos dentro del rango
    const ingresosPorDia = ingresos.reduce((acc, ingreso) => {
      const fechaIngreso = new Date(ingreso.fecha);
      if (fechaIngreso >= fechaLimite && fechaIngreso <= fechaActual) {
        const fechaKey = fechaIngreso.toLocaleDateString("es-AR");
        acc[fechaKey] = (acc[fechaKey] || 0) + ingreso.importe;
      }
      return acc;
    }, {});

    // Asegurar que todas las fechas estén presentes
    const datosCompletos = todasLasFechas.reduce((acc, fecha) => {
      acc[fecha] = ingresosPorDia[fecha] || 0;
      return acc;
    }, {});

    return {
      labels: Object.keys(datosCompletos),
      datasets: [
        {
          label: "Ingresos Diarios",
          data: Object.values(datosCompletos),
          borderColor: "rgba(40, 167, 69, 0.45)",
          backgroundColor: "rgba(40, 167, 69, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  } catch (error) {
    console.error("Error en procesarIngresosPorDia:", error);
    return datosIniciales.diario;
  }
};

export const procesarIngresosTotal = (ingresos = [], periodo = "mensual") => {
  try {
    let fechaInicio = new Date();

    // Establecer la fecha de inicio según el período
    switch (periodo) {
      case "mensual":
        fechaInicio.setMonth(fechaInicio.getMonth() - 1);
        break;
      case "trimestral":
        fechaInicio.setMonth(fechaInicio.getMonth() - 3);
        break;
      case "semestral":
        fechaInicio.setMonth(fechaInicio.getMonth() - 6);
        break;
      case "anual":
        fechaInicio.setFullYear(fechaInicio.getFullYear() - 1);
        break;
      case "historico":
        fechaInicio = new Date(0);
        break;
      default:
        fechaInicio.setMonth(fechaInicio.getMonth() - 1);
    }

    // Filtrar y agrupar ingresos por día
    const ingresosPorDia = ingresos
      .filter((ingreso) => new Date(ingreso.fecha) >= fechaInicio)
      .reduce((acc, ingreso) => {
        const fecha = new Date(ingreso.fecha).toLocaleDateString("es-AR");
        if (ingreso.importe > 0) {
          // Solo incluir días con ingresos positivos
          acc[fecha] = (acc[fecha] || 0) + ingreso.importe;
        }
        return acc;
      }, {});

    // Convertir a array y ordenar por fecha (ascendente)
    const fechasOrdenadas = Object.keys(ingresosPorDia).sort((a, b) => {
      const fechaA = a.split("/").reverse().join("");
      const fechaB = b.split("/").reverse().join("");
      return fechaA.localeCompare(fechaB);
    });

    // Calcular el acumulado
    let acumulado = 0;
    const datosAcumulados = fechasOrdenadas.map((fecha) => {
      acumulado += ingresosPorDia[fecha];
      return {
        fecha,
        total: acumulado,
      };
    });

    return {
      labels: datosAcumulados.map((item) => item.fecha),
      datasets: [
        {
          label: "Total Acumulado",
          data: datosAcumulados.map((item) => item.total),
          borderColor: "rgba(0, 123, 255, 0.45)",
          backgroundColor: "rgba(0, 123, 255, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  } catch (error) {
    console.error("Error en procesarIngresosTotal:", error);
    return datosIniciales.total;
  }
};

export const procesarIngresosPorMedio = (
  ingresos = [],
  periodo = "mensual"
) => {
  try {
    let fechaInicio = new Date();

    switch (periodo) {
      case "mensual":
        fechaInicio.setMonth(fechaInicio.getMonth() - 1);
        break;
      case "trimestral":
        fechaInicio.setMonth(fechaInicio.getMonth() - 3);
        break;
      case "semestral":
        fechaInicio.setMonth(fechaInicio.getMonth() - 6);
        break;
      case "anual":
        fechaInicio.setFullYear(fechaInicio.getFullYear() - 1);
        break;
      case "historico":
        fechaInicio = new Date(0);
        break;
      default:
        fechaInicio.setMonth(fechaInicio.getMonth() - 1);
    }

    const ingresosFiltrados = ingresos.filter(
      (ingreso) => new Date(ingreso.fecha) >= fechaInicio
    );

    const mediosPago = ingresosFiltrados.reduce(
      (acc, ingreso) => {
        if (ingreso.categoria.nombre === "EFECTIVO") {
          acc.efectivo += ingreso.importe;
        } else {
          acc.electronico += ingreso.importe;
        }
        return acc;
      },
      { efectivo: 0, electronico: 0 }
    );

    return {
      labels: ["Efectivo", "Electrónico"],
      datasets: [
        {
          label: "Ingresos por Medio de Pago",
          data: [mediosPago.efectivo, mediosPago.electronico],
          backgroundColor: [
            "rgba(40, 167, 69, 0.45)",
            "rgba(0, 123, 255, 0.45)",
          ],
          borderColor: ["#28a745", "#007bff"],
          borderWidth: 1,
        },
      ],
    };
  } catch (error) {
    console.error("Error en procesarIngresosPorMedio:", error);
    return datosIniciales.mediosPago;
  }
};

export const opcionesGraficos = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 2000,
    easing: "easeInOutQuart",
    delay: (context) => context.dataIndex * 100,
  },
  plugins: {
    legend: {
      display: true,
      labels: { color: "white" },
    },
  },
  scales: {
    y: {
      ticks: { color: "white" },
      grid: { color: "rgba(255, 255, 255, 0.1)" },
    },
    x: {
      ticks: { color: "white" },
      grid: { color: "rgba(255, 255, 255, 0.1)" },
    },
  },
};

// Datos iniciales para los gráficos
export const datosIniciales = {
  diario: {
    labels: [],
    datasets: [
      {
        label: "Ingresos Diarios",
        data: [],
        borderColor: "rgba(40, 167, 69, 0.45)",
        backgroundColor: "rgba(40, 167, 69, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  },
  total: {
    labels: [],
    datasets: [
      {
        label: "Total Acumulado",
        data: [],
        borderColor: "rgba(0, 123, 255, 0.45)",
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  },
  mediosPago: {
    labels: ["Efectivo", "Electrónico"],
    datasets: [
      {
        label: "Ingresos por Medio de Pago",
        data: [0, 0],
        backgroundColor: ["rgba(40, 167, 69, 0.45)", "rgba(0, 123, 255, 0.45)"],
        borderColor: ["#28a745", "#007bff"],
        borderWidth: 1,
      },
    ],
  },
};
