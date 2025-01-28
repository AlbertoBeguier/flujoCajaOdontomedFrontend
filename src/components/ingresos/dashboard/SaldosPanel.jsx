import { useState, useEffect } from "react";
import { getIngresos } from "../../../services/ingresosService";
import "./SaldosPanel.scss";

export const SaldosPanel = () => {
  const [saldos, setSaldos] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatearImporte = (importe) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(importe);
  };

  useEffect(() => {
    const calcularSaldos = async () => {
      try {
        setIsLoading(true);
        const ingresos = await getIngresos();
        const saldosPorCategoria = {};

        // Solo procesar categorías principales
        ingresos.forEach((ingreso) => {
          const rutaCompleta = ingreso.categoria.rutaCategoria;
          let nodoActual = saldosPorCategoria;

          rutaCompleta.forEach((cat) => {
            if (!nodoActual[cat.nombre]) {
              nodoActual[cat.nombre] = {
                saldo: 0,
                subcategorias: {},
                nivel: cat.codigo.split(".").length,
              };
            }
            nodoActual[cat.nombre].saldo += ingreso.importe;
            nodoActual = nodoActual[cat.nombre].subcategorias;
          });
        });

        setSaldos(saldosPorCategoria);
      } catch (error) {
        setError("Error al cargar los saldos");
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    calcularSaldos();
  }, []);

  const renderizarCategoria = (nombre, datos, nivel = 1) => {
    const nivelClase = `nivel-${nivel}`;
    return (
      <div key={nombre}>
        <div className={`saldo-item ${nivelClase}`}>
          <span>{nombre}:</span>
          <span>{formatearImporte(datos.saldo)}</span>
        </div>
        {Object.entries(datos.subcategorias)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([subNombre, subDatos]) =>
            renderizarCategoria(subNombre, subDatos, nivel + 1)
          )}
      </div>
    );
  };

  if (isLoading)
    return <div className="saldos-cargando">Calculando saldos...</div>;
  if (error) return <div className="saldos-error">{error}</div>;

  return (
    <div className="saldos-panel">
      <h3 className="saldos-titulo">SALDOS ACTUALES</h3>
      <div className="saldos-container">
        {Object.entries(saldos)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([nombre, datos]) => renderizarCategoria(nombre, datos))}
      </div>
    </div>
  );
};
