export const procesarEgresosPorDia = (egresos = [], dias = 7) => {
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

    const egresosPorDia = egresos.reduce((acc, egreso) => {
      const fechaEgreso = new Date(egreso.fecha);
      if (fechaEgreso >= fechaLimite && fechaEgreso <= fechaActual) {
        const fechaKey = fechaEgreso.toLocaleDateString("es-AR");
        acc[fechaKey] = (acc[fechaKey] || 0) + egreso.importe;
      }
      return acc;
    }, {});

    const datosCompletos = todasLasFechas.reduce((acc, fecha) => {
      acc[fecha] = egresosPorDia[fecha] || 0;
      return acc;
    }, {});

    return {
      labels: Object.keys(datosCompletos),
      datasets: [
        {
          label: "Gastos Diarios",
          data: Object.values(datosCompletos),
          borderColor: "rgba(220, 53, 69, 0.45)", // Color rojo para gastos
          backgroundColor: "rgba(220, 53, 69, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  } catch (error) {
    console.error("Error en procesarEgresosPorDia:", error);
    return datosInicialesEgresos.diario;
  }
};

export const procesarEgresosTotal = (egresos = [], periodo = "mensual") => {
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

    const egresosFiltrados = egresos
      .filter((egreso) => new Date(egreso.fecha) >= fechaInicio)
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    let acumulado = 0;
    const datosAcumulados = egresosFiltrados.map((egreso) => {
      acumulado += egreso.importe;
      return {
        fecha: new Date(egreso.fecha).toLocaleDateString("es-AR"),
        total: acumulado,
      };
    });

    return {
      labels: datosAcumulados.map((dato) => dato.fecha),
      datasets: [
        {
          label: "Total Acumulado",
          data: datosAcumulados.map((dato) => dato.total),
          borderColor: "rgba(220, 53, 69, 0.45)", // Color rojo para gastos
          backgroundColor: "rgba(220, 53, 69, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  } catch (error) {
    console.error("Error en procesarEgresosTotal:", error);
    return datosInicialesEgresos.total;
  }
};

export const procesarEgresosPorTipo = (egresos = [], periodo = "mensual") => {
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

    const egresosFiltrados = egresos.filter(
      (egreso) => new Date(egreso.fecha) >= fechaInicio
    );

    const egresosPorTipo = egresosFiltrados.reduce((acc, egreso) => {
      const tipo = egreso.categoria.nombre;
      acc[tipo] = (acc[tipo] || 0) + egreso.importe;
      return acc;
    }, {});

    // Ordenar por monto de mayor a menor
    const tiposOrdenados = Object.entries(egresosPorTipo)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5); // Tomar los 5 tipos con más gastos

    return {
      labels: tiposOrdenados.map(([tipo]) => tipo),
      datasets: [
        {
          label: "Gastos por Tipo",
          data: tiposOrdenados.map(([, monto]) => monto),
          backgroundColor: [
            "rgba(220, 53, 69, 0.45)",
            "rgba(255, 193, 7, 0.45)",
            "rgba(23, 162, 184, 0.45)",
            "rgba(40, 167, 69, 0.45)",
            "rgba(111, 66, 193, 0.45)",
          ],
          borderColor: [
            "rgb(220, 53, 69)",
            "rgb(255, 193, 7)",
            "rgb(23, 162, 184)",
            "rgb(40, 167, 69)",
            "rgb(111, 66, 193)",
          ],
          borderWidth: 1,
        },
      ],
    };
  } catch (error) {
    console.error("Error en procesarEgresosPorTipo:", error);
    return datosInicialesEgresos.tiposGasto;
  }
};

export const opcionesBase = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
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

export const datosInicialesEgresos = {
  diario: {
    labels: [],
    datasets: [
      {
        label: "Gastos Diarios",
        data: [],
        borderColor: "rgba(220, 53, 69, 0.45)",
        backgroundColor: "rgba(220, 53, 69, 0.2)",
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
        borderColor: "rgba(220, 53, 69, 0.45)",
        backgroundColor: "rgba(220, 53, 69, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  },
  tiposGasto: {
    labels: [],
    datasets: [
      {
        label: "Gastos por Tipo",
        data: [],
        backgroundColor: [
          "rgba(220, 53, 69, 0.45)",
          "rgba(255, 193, 7, 0.45)",
          "rgba(23, 162, 184, 0.45)",
          "rgba(40, 167, 69, 0.45)",
          "rgba(111, 66, 193, 0.45)",
        ],
        borderColor: [
          "rgb(220, 53, 69)",
          "rgb(255, 193, 7)",
          "rgb(23, 162, 184)",
          "rgb(40, 167, 69)",
          "rgb(111, 66, 193)",
        ],
        borderWidth: 1,
      },
    ],
  },
};
