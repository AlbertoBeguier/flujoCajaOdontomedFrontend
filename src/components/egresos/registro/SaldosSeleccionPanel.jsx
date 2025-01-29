import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getSaldosCalculados } from "../../../services/saldosService";
import "./SaldosSeleccionPanel.scss";

export const SaldosSeleccionPanel = ({
  onSaldoSeleccionado,
  actualizarSaldos,
}) => {
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
        setError(null);
        const saldosCalculados = await getSaldosCalculados();
        setSaldos(saldosCalculados);
      } catch (error) {
        setError("Error al cargar los saldos: " + error.message);
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    cargarSaldos();
  }, [actualizarSaldos]);

  const handleSaldoClick = (nombre, datos) => {
    if (datos.esSeleccionable) {
      const saldoSeleccionado = {
        nombre: nombre,
        saldo: datos.saldo,
        rutaCategoria: datos.rutaCompleta,
        categoriaId: datos.codigo,
      };
      onSaldoSeleccionado(saldoSeleccionado);
    }
  };

  const renderizarCategoria = (nombre, datos) => {
    if (
      datos.saldo === 0 &&
      Object.values(datos.subcategorias).every((sub) => sub.saldo === 0)
    ) {
      return null;
    }

    return (
      <div
        key={nombre}
        className={`item-saldo-egreso nivel-${datos.nivel} ${
          datos.esSeleccionable ? "seleccionable" : ""
        }`}
        onClick={() => datos.esSeleccionable && handleSaldoClick(nombre, datos)}
      >
        <div className="contenido-saldo-egreso">
          <span className="nombre-saldo-egreso">{nombre}</span>
          <span className="monto-saldo-egreso">
            {formatearImporte(datos.saldo)}
          </span>
        </div>
      </div>
    );
  };

  const renderizarArbol = (nodo) => {
    return Object.entries(nodo)
      .filter(([, datos]) => datos.saldo !== 0)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([nombre, datos]) => (
        <div key={nombre} className="nodo-arbol">
          {renderizarCategoria(nombre, datos)}
          <div className="subcategorias">
            {renderizarArbol(datos.subcategorias)}
          </div>
        </div>
      ));
  };

  if (isLoading)
    return <div className="saldos-cargando">Calculando saldos...</div>;
  if (error) return <div className="saldos-error">{error}</div>;

  return (
    <div className="panel-saldos-egresos">
      <h3 className="titulo-saldos-egresos">SELECCIONE SALDO A UTILIZAR</h3>
      <div className="contenedor-saldos-egresos">
        {Object.keys(saldos).length === 0 ? (
          <div className="sin-saldos-egresos">No hay saldos disponibles</div>
        ) : (
          renderizarArbol(saldos)
        )}
      </div>
    </div>
  );
};

SaldosSeleccionPanel.propTypes = {
  onSaldoSeleccionado: PropTypes.func.isRequired,
  actualizarSaldos: PropTypes.number.isRequired,
};
