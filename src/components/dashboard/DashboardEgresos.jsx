import { useState, useEffect } from "react";
import { getEgresos } from "../../services/egresosService";
import { GraficoEgresosDiarios } from "./GraficoEgresosDiarios";
import { GraficoTotalAcumuladoEgresos } from "./GraficoTotalAcumuladoEgresos";
import { GraficoTiposGasto } from "./GraficoTiposGasto";
import {
  procesarEgresosPorDia,
  procesarEgresosTotal,
  procesarDatosEgresos,
  opcionesBase,
  datosInicialesEgresos,
} from "./utils/procesadorDatosEgresos";
import "./DashboardEgresos.scss";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const DashboardEgresos = () => {
  const [datosGraficos, setDatosGraficos] = useState(datosInicialesEgresos);
  const [isLoading, setIsLoading] = useState(true);
  const [diasSeleccionados, setDiasSeleccionados] = useState(7);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("mensual");
  const [periodoTiposGasto, setPeriodoTiposGasto] = useState("mensual");

  const periodos = [
    { valor: "mensual", texto: "Mensual" },
    { valor: "trimestral", texto: "Trimestral" },
    { valor: "semestral", texto: "Semestral" },
    { valor: "anual", texto: "Anual" },
    { valor: "historico", texto: "Histórico" },
  ];

  useEffect(() => {
    const cargarDatosEgresos = async () => {
      try {
        const egresos = await getEgresos();
        setDatosGraficos({
          diario: procesarEgresosPorDia(egresos, diasSeleccionados),
          total: procesarEgresosTotal(egresos, periodoSeleccionado),
          tiposGasto: procesarDatosEgresos(egresos, periodoTiposGasto),
        });
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    cargarDatosEgresos();
  }, [diasSeleccionados, periodoSeleccionado, periodoTiposGasto]);

  if (isLoading) {
    return <div className="dashboard-loading">Cargando datos...</div>;
  }

  if (
    !datosGraficos.diario?.labels ||
    !datosGraficos.total?.labels ||
    !datosGraficos.tiposGasto?.labels
  ) {
    return <div className="dashboard-loading">Error al cargar los datos</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-line">
          <div className="line-left"></div>
          <h2 className="dashboard-title">Egresos</h2>
          <div className="line-right"></div>
        </div>
      </div>

      <div className="graficos-grid">
        <GraficoEgresosDiarios
          datos={datosGraficos.diario}
          opciones={opcionesBase}
          diasSeleccionados={diasSeleccionados}
          setDiasSeleccionados={setDiasSeleccionados}
        />
        <GraficoTotalAcumuladoEgresos
          datos={datosGraficos.total}
          opciones={opcionesBase}
          periodoSeleccionado={periodoSeleccionado}
          setPeriodoSeleccionado={setPeriodoSeleccionado}
          periodos={periodos}
        />
        <GraficoTiposGasto
          datos={datosGraficos.tiposGasto}
          opciones={opcionesBase}
          periodoTiposGasto={periodoTiposGasto}
          setPeriodoTiposGasto={setPeriodoTiposGasto}
          periodos={periodos}
        />
      </div>

      <div className="separator-line"></div>
    </div>
  );
};
