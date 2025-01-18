export const datosIniciales = {
  diario: {
    labels: [],
    datasets: [
      {
        label: "Ingresos Diarios",
        data: [],
        borderColor: "rgba(40, 167, 69, 0.8)",
        backgroundColor: "rgba(40, 167, 69, 0.1)",
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
        borderColor: "rgba(40, 167, 69, 0.8)",
        backgroundColor: "rgba(40, 167, 69, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  },
  mediosPago: {
    labels: [],
    datasets: [
      {
        label: "Ingresos por Medio de Pago",
        data: [],
        backgroundColor: ["rgba(40, 167, 69, 0.3)", "rgba(0, 123, 255, 0.3)"],
        borderColor: ["rgb(40, 167, 69)", "rgb(0, 123, 255)"],
        borderWidth: 1,
      },
    ],
  },
};

export const opcionesBase = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "index",
    intersect: false,
  },
  plugins: {
    legend: {
      display: true,
      position: "top",
      align: "center",
      labels: {
        color: "white",
        padding: 15,
        font: {
          size: 12,
        },
        boxWidth: 12,
        boxHeight: 12,
        usePointStyle: true,
        pointStyle: "rect",
      },
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const value = context.raw;
          return `${context.dataset.label}: ${new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            maximumFractionDigits: 0,
          }).format(value)}`;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: "white",
        callback: (value) =>
          new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            maximumFractionDigits: 0,
          }).format(value),
      },
      grid: { color: "rgba(255, 255, 255, 0.1)" },
    },
    x: {
      ticks: { color: "white" },
      grid: { color: "rgba(255, 255, 255, 0.1)" },
    },
  },
};

export const procesarIngresosPorDia = (ingresos = [], dias = 7) => {
  try {
    const fechaActual = new Date();
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - (dias - 1));
    fechaLimite.setHours(0, 0, 0, 0);

    const todasLasFechas = [];
    for (let d = 0; d < dias; d++) {
      const fecha = new Date(fechaActual);
      fecha.setDate(fecha.getDate() - d);
      todasLasFechas.unshift(fecha.toLocaleDateString("es-AR"));
    }

    const ingresosPorDia = ingresos.reduce((acc, ingreso) => {
      const fechaIngreso = new Date(ingreso.fecha);
      if (fechaIngreso >= fechaLimite && fechaIngreso <= fechaActual) {
        const fechaKey = fechaIngreso.toLocaleDateString("es-AR");
        acc[fechaKey] = (acc[fechaKey] || 0) + ingreso.importe;
      }
      return acc;
    }, {});

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
          borderColor: "rgba(40, 167, 69, 0.8)",
          backgroundColor: "rgba(40, 167, 69, 0.1)",
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

    const ingresosFiltrados = ingresos
      .filter((ingreso) => new Date(ingreso.fecha) >= fechaInicio)
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    let acumulado = 0;
    const datosAcumulados = ingresosFiltrados.map((ingreso) => {
      acumulado += ingreso.importe;
      return {
        fecha: new Date(ingreso.fecha).toLocaleDateString("es-AR"),
        total: acumulado,
      };
    });

    return {
      labels: datosAcumulados.map((dato) => dato.fecha),
      datasets: [
        {
          label: "Total Acumulado",
          data: datosAcumulados.map((dato) => dato.total),
          borderColor: "rgba(40, 167, 69, 0.8)",
          backgroundColor: "rgba(40, 167, 69, 0.1)",
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
        if (ingreso.categoria?.nombre?.toLowerCase() === "efectivo") {
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
          backgroundColor: ["rgba(40, 167, 69, 0.3)", "rgba(0, 123, 255, 0.3)"],
          borderColor: ["rgb(40, 167, 69)", "rgb(0, 123, 255)"],
          borderWidth: 1,
        },
      ],
    };
  } catch (error) {
    console.error("Error en procesarDatosIngresos:", error);
    return datosIniciales.mediosPago;
  }
};
