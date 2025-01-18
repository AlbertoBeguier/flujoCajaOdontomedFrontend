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
          label: "Egresos Diarios",
          data: Object.values(datosCompletos),
          borderColor: "rgba(128, 128, 128, 0.45)", // Gris para gastos
          backgroundColor: "rgba(128, 128, 128, 0.2)",
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
          borderColor: "rgba(128, 128, 128, 0.45)", // Gris para gastos
          backgroundColor: "rgba(128, 128, 128, 0.2)",
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
          label: "Egresos por Tipo",
          data: tiposOrdenados.map(([, monto]) => monto),
          backgroundColor: [
            "rgba(128, 128, 128, 0.45)",
            "rgba(169, 169, 169, 0.45)",
            "rgba(23, 162, 184, 0.45)",
            "rgba(40, 167, 69, 0.45)",
            "rgba(111, 66, 193, 0.45)",
          ],
          borderColor: [
            "rgb(128, 128, 128)",
            "rgb(169, 169, 169)",
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
  animation: {
    duration: 2000,
    easing: "easeInOutQuart",
    delay: (context) => context.dataIndex * 100,
  },
  plugins: {
    legend: {
      display: true,
      labels: {
        color: "white",
        usePointStyle: true,
        pointStyle: "rect",
        boxWidth: 10,
        boxHeight: 10,
      },
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

export const datosInicialesEgresos = {
  diario: {
    labels: [],
    datasets: [
      {
        label: "Egresos Diarios",
        data: [],
        borderColor: "rgba(128, 128, 128, 0.45)",
        backgroundColor: "rgba(128, 128, 128, 0.2)",
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
        borderColor: "rgba(128, 128, 128, 0.45)",
        backgroundColor: "rgba(128, 128, 128, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  },
  tiposGasto: {
    labels: [],
    datasets: [
      {
        label: "Egresos por Tipo",
        data: [],
        backgroundColor: [
          "rgba(128, 128, 128, 0.45)",
          "rgba(169, 169, 169, 0.45)",
          "rgba(23, 162, 184, 0.45)",
          "rgba(40, 167, 69, 0.45)",
          "rgba(111, 66, 193, 0.45)",
        ],
        borderColor: [
          "rgb(128, 128, 128)",
          "rgb(169, 169, 169)",
          "rgb(23, 162, 184)",
          "rgb(40, 167, 69)",
          "rgb(111, 66, 193)",
        ],
        borderWidth: 1,
      },
    ],
  },
};

export const procesarDatosEgresos = (egresos = [], periodo = "mensual") => {
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

    const mediosPago = egresosFiltrados.reduce(
      (acc, egreso) => {
        const metodoPago = egreso.categoria.nombre.toLowerCase();
        if (metodoPago === "efectivo") {
          acc.efectivo += egreso.importe;
        } else {
          acc.electronico += egreso.importe;
        }
        return acc;
      },
      { efectivo: 0, electronico: 0 }
    );

    return {
      labels: ["Efectivo", "Electrónico"],
      datasets: [
        {
          label: "Egresos por Medio de Pago",
          data: [mediosPago.efectivo, mediosPago.electronico],
          backgroundColor: [
            "rgba(128, 128, 128, 0.3)", // Gris para Efectivo, más transparente
            "rgba(169, 169, 169, 0.3)", // Gris más claro para Electrónico, más transparente
          ],
          borderColor: ["rgb(128, 128, 128)", "rgb(169, 169, 169)"],
          borderWidth: 1,
        },
      ],
    };
  } catch (error) {
    console.error("Error en procesarDatosEgresos:", error);
    return datosInicialesEgresos.tiposGasto;
  }
};
