import { useState, useEffect } from "react";
import { getIngresos } from "../../services/ingresosService";
import { GraficoIngresosDiarios } from "./GraficoIngresosDiarios";
import { GraficoTotalAcumulado } from "./GraficoTotalAcumulado";
import { GraficoMediosPago } from "./GraficoMediosPago";
import {
  procesarIngresosPorDia,
  procesarIngresosTotal,
  procesarIngresosPorMedio,
  opcionesBase,
  datosIniciales,
} from "./utils/procesadorDatos";
import "./DashboardIngresos.scss";
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
  Filler,
} from "chart.js";

// Registramos todos los componentes necesarios
ChartJS.register(
  CategoryScale, // Escala para categorías (eje X)
  LinearScale, // Escala lineal (eje Y)
  PointElement, // Puntos en las líneas
  LineElement, // Líneas
  BarElement, // Barras
  Title, // Títulos
  Tooltip, // Tooltips
  Legend, // Leyendas
  Filler // Relleno bajo las líneas
);

export const DashboardIngresos = () => {
  const [datosGraficos, setDatosGraficos] = useState(datosIniciales);
  const [isLoading, setIsLoading] = useState(true);
  const [diasSeleccionados, setDiasSeleccionados] = useState(7);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("mensual");
  const [periodoMediosPago, setPeriodoMediosPago] = useState("mensual");

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
          diario: procesarIngresosPorDia(ingresos, diasSeleccionados),
          total: procesarIngresosTotal(ingresos, periodoSeleccionado),
          mediosPago: procesarIngresosPorMedio(ingresos, periodoMediosPago),
        });
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    cargarDatosIngresos();
  }, [diasSeleccionados, periodoSeleccionado, periodoMediosPago]);

  if (isLoading) {
    return <div className="dashboard-loading">Cargando datos...</div>;
  }

  if (
    !datosGraficos.diario?.labels ||
    !datosGraficos.total?.labels ||
    !datosGraficos.mediosPago?.labels
  ) {
    return <div className="dashboard-loading">Error al cargar los datos</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-line">
          <div className="line-left"></div>
          <h2 className="dashboard-title">Ingresos</h2>
          <div className="line-right"></div>
        </div>
      </div>

      <div className="graficos-grid">
        <GraficoIngresosDiarios
          datos={datosGraficos.diario}
          opciones={opcionesBase}
          diasSeleccionados={diasSeleccionados}
          setDiasSeleccionados={setDiasSeleccionados}
        />
        <GraficoTotalAcumulado
          datos={datosGraficos.total}
          opciones={opcionesBase}
          periodoSeleccionado={periodoSeleccionado}
          setPeriodoSeleccionado={setPeriodoSeleccionado}
          periodos={periodos}
        />
        <GraficoMediosPago
          datos={datosGraficos.mediosPago}
          opciones={opcionesBase}
          periodoMediosPago={periodoMediosPago}
          setPeriodoMediosPago={setPeriodoMediosPago}
          periodos={periodos}
        />
      </div>

      <div className="separator-line"></div>
    </div>
  );
};
