import { useState, useEffect } from "react";
import { getSaldosCalculados } from "../../../services/saldosService";
import "./SaldosPanelEgresos.scss";

export const SaldosPanelEgresos = () => {
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
    const cargarSaldos = async () => {
      try {
        setIsLoading(true);
        const saldosCalculados = await getSaldosCalculados();
        setSaldos(saldosCalculados);
      } catch {
        setError("Error al cargar los saldos");
      } finally {
        setIsLoading(false);
      }
    };

    cargarSaldos();
  }, []);

  const renderizarCategoria = (nombre, datos, nivel = 1) => {
    // Si el saldo es 0 y no tiene subcategorías con saldos, no renderizar
    if (
      datos.saldo === 0 &&
      Object.values(datos.subcategorias).every((sub) => sub.saldo === 0)
    ) {
      return null;
    }

    const nivelClase = `nivel-egresos-${nivel}`;
    return (
      <div key={nombre}>
        <div className={`saldo-egresos-item ${nivelClase}`}>
          <span>{nombre}:</span>
          <span>{formatearImporte(datos.saldo)}</span>
        </div>
        {Object.entries(datos.subcategorias)
          .filter(([, subDatos]) => subDatos.saldo !== 0)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([subNombre, subDatos]) =>
            renderizarCategoria(subNombre, subDatos, nivel + 1)
          )}
      </div>
    );
  };

  if (isLoading)
    return <div className="saldos-egresos-cargando">Calculando saldos...</div>;
  if (error) return <div className="saldos-egresos-error">{error}</div>;

  return (
    <div className="saldos-egresos-panel">
      <h3 className="saldos-egresos-titulo">SALDOS ACTUALES</h3>
      <div className="saldos-egresos-container">
        {Object.entries(saldos)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([nombre, datos]) => renderizarCategoria(nombre, datos))}
      </div>
    </div>
  );
};
