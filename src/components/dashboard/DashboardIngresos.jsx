import { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getIngresos } from "../../services/ingresosService";
import "./DashboardIngresos.scss";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const DashboardIngresos = () => {
  const [datosGraficos, setDatosGraficos] = useState({
    diario: { labels: [], datasets: [] },
    total: { labels: [], datasets: [] },
    mediosPago: { labels: [], datasets: [] },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("mensual");

  const periodos = [
    { valor: "mensual", texto: "Mensual" },
    { valor: "trimestral", texto: "Trimestral" },
    { valor: "semestral", texto: "Semestral" },
    { valor: "anual", texto: "Anual" },
    { valor: "historico", texto: "Histórico" },
  ];

  useEffect(() => {
    const cargarDatosIngresos = async () => {
      try {
        const ingresos = await getIngresos();
        setDatosGraficos({
          diario: procesarIngresosPorDia(ingresos),
          total: procesarIngresosTotal(ingresos, periodoSeleccionado),
          mediosPago: procesarIngresosPorMedio(ingresos),
        });
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    cargarDatosIngresos();
  }, [periodoSeleccionado]);

  const procesarIngresosPorDia = (ingresos) => {
    const ingresosPorDia = ingresos.reduce((acc, ingreso) => {
      const fecha = new Date(ingreso.fecha).toLocaleDateString("es-AR");
      acc[fecha] = (acc[fecha] || 0) + ingreso.importe;
      return acc;
    }, {});

    const fechas = Object.keys(ingresosPorDia)
      .sort((a, b) => new Date(b) - new Date(a))
      .slice(0, 7)
      .reverse();

    return {
      labels: fechas,
      datasets: [
        {
          label: "Ingresos Diarios",
          data: fechas.map((fecha) => ingresosPorDia[fecha]),
          borderColor: "rgba(40, 167, 69, 0.45)",
          backgroundColor: "rgba(40, 167, 69, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };

  const procesarIngresosTotal = (ingresos, periodo) => {
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
    }

    const ingresosFiltrados = ingresos
      .filter((ingreso) => new Date(ingreso.fecha) >= fechaInicio)
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    let total = 0;
    const totalesPorDia = ingresosFiltrados.map((ingreso) => {
      total += ingreso.importe;
      return {
        fecha: new Date(ingreso.fecha).toLocaleDateString("es-AR"),
        total,
      };
    });

    return {
      labels: totalesPorDia.map((item) => item.fecha),
      datasets: [
        {
          label: "Total Acumulado",
          data: totalesPorDia.map((item) => item.total),
          borderColor: "rgba(0, 123, 255, 0.45)",
          backgroundColor: "rgba(0, 123, 255, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };

  const procesarIngresosPorMedio = (ingresos) => {
    const mediosPago = ingresos.reduce(
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
  };

  const opcionesBase = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        color: "white",
        anchor: "end",
        align: "start",
        offset: 4,
        formatter: (value, context) => {
          return context.chart.data.labels[context.dataIndex];
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

  if (isLoading) {
    return <div className="dashboard-loading">Cargando datos...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="graficos-grid">
        <div className="grafico-item">
          <h3>Ingresos Diarios</h3>
          <Line data={datosGraficos.diario} options={opcionesBase} />
        </div>
        <div className="grafico-item">
          <div className="grafico-header">
            <h3>Total Acumulado</h3>
            <select
              value={periodoSeleccionado}
              onChange={(e) => setPeriodoSeleccionado(e.target.value)}
              className="periodo-selector"
            >
              {periodos.map((periodo) => (
                <option key={periodo.valor} value={periodo.valor}>
                  {periodo.texto}
                </option>
              ))}
            </select>
          </div>
          <Line data={datosGraficos.total} options={opcionesBase} />
        </div>
        <div className="grafico-item">
          <h3>Por Medio de Pago</h3>
          <Bar data={datosGraficos.mediosPago} options={opcionesBase} />
        </div>
      </div>
    </div>
  );
};
