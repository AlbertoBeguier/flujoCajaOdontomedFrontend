import { format } from "date-fns";
import { es } from "date-fns/locale";

export const procesarDatosComparativos = (
  ingresos = [],
  egresos = [],
  dias = 30
) => {
  try {
    const fechaActual = new Date();
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - (dias - 1));
    fechaLimite.setHours(0, 0, 0, 0);

    // Generar array de fechas
    const todasLasFechas = [];
    for (let d = 0; d < dias; d++) {
      const fecha = new Date(fechaActual);
      fecha.setDate(fecha.getDate() - d);
      todasLasFechas.unshift(format(fecha, "dd/MM/yy", { locale: es }));
    }

    // Procesar ingresos y egresos por día
    const ingresosPorDia = procesarMovimientosPorDia(
      ingresos,
      fechaLimite,
      fechaActual
    );
    const egresosPorDia = procesarMovimientosPorDia(
      egresos,
      fechaLimite,
      fechaActual
    );

    // Completar datos para todas las fechas
    const datosCompletos = todasLasFechas.reduce(
      (acc, fecha) => {
        acc.ingresos[fecha] = ingresosPorDia[fecha] || 0;
        acc.egresos[fecha] = egresosPorDia[fecha] || 0;
        acc.balance[fecha] =
          (ingresosPorDia[fecha] || 0) - (egresosPorDia[fecha] || 0);
        return acc;
      },
      { ingresos: {}, egresos: {}, balance: {} }
    );

    return {
      comparativoDiario: generarDatosComparativos(
        datosCompletos,
        todasLasFechas
      ),
      acumulados: generarDatosAcumulados(datosCompletos, todasLasFechas),
      balanceNeto: generarDatosBalance(datosCompletos, todasLasFechas),
    };
  } catch (error) {
    console.error("Error en procesarDatosComparativos:", error);
    return datosInicialesComparativos;
  }
};

const procesarMovimientosPorDia = (movimientos, fechaLimite, fechaActual) => {
  return movimientos.reduce((acc, mov) => {
    const fechaMov = new Date(mov.fecha);
    if (fechaMov >= fechaLimite && fechaMov <= fechaActual) {
      const fechaKey = format(fechaMov, "dd/MM/yy", { locale: es });
      acc[fechaKey] = (acc[fechaKey] || 0) + mov.importe;
    }
    return acc;
  }, {});
};

const generarDatosComparativos = (datos, fechas) => ({
  labels: fechas,
  datasets: [
    {
      label: "Ingresos",
      data: fechas.map((fecha) => datos.ingresos[fecha]),
      borderColor: "rgba(40, 167, 69, 0.8)",
      backgroundColor: (context) => {
        const ingresos = context.dataset.data[context.dataIndex] || 0;
        const gastos =
          context.chart.data.datasets[1].data[context.dataIndex] || 0;
        return ingresos > gastos
          ? "rgba(0, 123, 255, 0.1)"
          : "rgba(40, 167, 69, 0.1)";
      },
      tension: 0.4,
      fill: true,
    },
    {
      label: "Gastos",
      data: fechas.map((fecha) => datos.egresos[fecha]),
      borderColor: "rgba(128, 128, 128, 0.8)",
      backgroundColor: (context) => {
        const gastos = context.dataset.data[context.dataIndex] || 0;
        const ingresos =
          context.chart.data.datasets[0].data[context.dataIndex] || 0;
        return gastos > ingresos
          ? "rgba(220, 53, 69, 0.1)"
          : "rgba(128, 128, 128, 0.1)";
      },
      tension: 0.4,
      fill: true,
    },
  ],
});

const generarDatosAcumulados = (datos, fechas) => ({
  labels: fechas,
  datasets: [
    {
      label: "Ingresos Acumulados",
      data: fechas.map((fecha, index) => {
        let acumuladoIngresos = 0;
        for (let i = 0; i <= index; i++) {
          acumuladoIngresos += datos.ingresos[fechas[i]] || 0;
        }
        return acumuladoIngresos;
      }),
      borderColor: "rgba(40, 167, 69, 0.8)",
      backgroundColor: (context) => {
        const ingresos = context.dataset.data[context.dataIndex] || 0;
        const gastos =
          context.chart.data.datasets[1].data[context.dataIndex] || 0;
        return ingresos > gastos
          ? "rgba(0, 123, 255, 0.1)"
          : "rgba(40, 167, 69, 0.1)";
      },
      tension: 0.4,
      fill: true,
    },
    {
      label: "Gastos Acumulados",
      data: fechas.map((fecha, index) => {
        let acumuladoEgresos = 0;
        for (let i = 0; i <= index; i++) {
          acumuladoEgresos += datos.egresos[fechas[i]] || 0;
        }
        return acumuladoEgresos;
      }),
      borderColor: "rgba(128, 128, 128, 0.8)",
      backgroundColor: (context) => {
        const gastos = context.dataset.data[context.dataIndex] || 0;
        const ingresos =
          context.chart.data.datasets[0].data[context.dataIndex] || 0;
        return gastos > ingresos
          ? "rgba(220, 53, 69, 0.1)"
          : "rgba(128, 128, 128, 0.1)";
      },
      tension: 0.4,
      fill: true,
    },
  ],
});

const generarDatosBalance = (datos, fechas) => ({
  labels: fechas,
  datasets: [
    {
      label: "Balance Neto",
      data: fechas.map((fecha) => datos.balance[fecha]),
      borderColor: "rgba(0, 123, 255, 0.8)",
      backgroundColor: "rgba(0, 123, 255, 0.1)",
      tension: 0.4,
      fill: {
        target: {
          value: 0,
        },
        above: "rgba(0, 123, 255, 0.1)",
        below: "rgba(128, 128, 128, 0.1)",
      },
    },
  ],
});

export const opcionesComparativas = {
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

export const datosInicialesComparativos = {
  comparativoDiario: {
    labels: [],
    datasets: [
      {
        label: "Ingresos",
        data: [],
        borderColor: "rgba(40, 167, 69, 0.8)",
        backgroundColor: "rgba(40, 167, 69, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Gastos",
        data: [],
        borderColor: "rgba(128, 128, 128, 0.8)",
        backgroundColor: "rgba(128, 128, 128, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  },
  acumulados: {
    labels: [],
    datasets: [
      {
        label: "Ingresos Acumulados",
        data: [],
        borderColor: "rgba(40, 167, 69, 0.8)",
        backgroundColor: "rgba(40, 167, 69, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Gastos Acumulados",
        data: [],
        borderColor: "rgba(128, 128, 128, 0.8)",
        backgroundColor: "rgba(128, 128, 128, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  },
  balanceNeto: {
    labels: [],
    datasets: [
      {
        label: "Balance Neto",
        data: [],
        borderColor: "rgba(0, 123, 255, 0.8)",
        backgroundColor: "rgba(40, 167, 69, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  },
};
