import { useState, useEffect, useRef } from "react";
import { getIngresos } from "../../services/ingresosService";
import { getEgresos } from "../../services/egresosService";
import { GraficoComparativoDiario } from "./GraficoComparativoDiario";
import { GraficoComparativoAcumulado } from "./GraficoComparativoAcumulado";
import { GraficoBalanceNeto } from "./GraficoBalanceNeto";
import {
  procesarDatosComparativos,
  opcionesComparativas,
  datosInicialesComparativos,
} from "./utils/procesadorDatosComparativo";
import "./DashboardComparativo.scss";

export const DashboardComparativo = () => {
  const [datosGraficos, setDatosGraficos] = useState(
    datosInicialesComparativos
  );
  const [isLoading, setIsLoading] = useState(true);
  const [diasSeleccionados, setDiasSeleccionados] = useState(7);
  const [periodoAcumulados, setPeriodoAcumulados] = useState("mensual");
  const [periodoBalance, setPeriodoBalance] = useState("mensual");

  // Referencias para los gráficos
  const graficoComparativoRef = useRef(null);
  const graficoAcumuladoRef = useRef(null);
  const graficoBalanceRef = useRef(null);

  const periodos = [
    { valor: "mensual", texto: "Mensual" },
    { valor: "trimestral", texto: "Trimestral" },
    { valor: "semestral", texto: "Semestral" },
    { valor: "anual", texto: "Anual" },
    { valor: "historico", texto: "Histórico" },
  ];

  useEffect(() => {
    // Limpiar gráficos anteriores
    const limpiarGraficos = () => {
      if (graficoComparativoRef.current) {
        graficoComparativoRef.current.destroy();
      }
      if (graficoAcumuladoRef.current) {
        graficoAcumuladoRef.current.destroy();
      }
      if (graficoBalanceRef.current) {
        graficoBalanceRef.current.destroy();
      }
    };

    const cargarDatos = async () => {
      try {
        limpiarGraficos();
        const [ingresos, egresos] = await Promise.all([
          getIngresos(),
          getEgresos(),
        ]);

        const datosComparativos = procesarDatosComparativos(
          ingresos,
          egresos,
          diasSeleccionados
        );

        setDatosGraficos(datosComparativos);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    cargarDatos();

    // Cleanup al desmontar
    return () => {
      limpiarGraficos();
    };
  }, [diasSeleccionados, periodoAcumulados, periodoBalance]);

  if (isLoading) {
    return <div className="dashboard-loading">Cargando datos...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-line">
          <div className="line-left"></div>
          <h2 className="dashboard-title">Análisis Comparativo</h2>
          <div className="line-right"></div>
        </div>
      </div>

      <div className="graficos-grid">
        <GraficoComparativoDiario
          datos={datosGraficos.comparativoDiario}
          opciones={opcionesComparativas}
          diasSeleccionados={diasSeleccionados}
          setDiasSeleccionados={setDiasSeleccionados}
          ref={graficoComparativoRef}
        />
        <GraficoComparativoAcumulado
          datos={datosGraficos.acumulados}
          opciones={opcionesComparativas}
          periodoSeleccionado={periodoAcumulados}
          setPeriodoSeleccionado={setPeriodoAcumulados}
          periodos={periodos}
          ref={graficoAcumuladoRef}
        />
        <GraficoBalanceNeto
          datos={datosGraficos.balanceNeto}
          opciones={opcionesComparativas}
          periodoSeleccionado={periodoBalance}
          setPeriodoSeleccionado={setPeriodoBalance}
          periodos={periodos}
          ref={graficoBalanceRef}
        />
      </div>
    </div>
  );
};
