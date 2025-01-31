import PropTypes from "prop-types";
import { useState } from "react";
import { updateEgreso } from "../../../services/egresosService";
import { useSubcategoriasEgresos } from "../../../hooks/useSubcategoriasEgresos";
import { FaChevronRight, FaUndo } from "react-icons/fa";
import "./EgresosDatosAdicionales.scss";

export const EgresosDatosAdicionales = ({ egreso, onClose, onUpdate }) => {
  const [observaciones, setObservaciones] = useState(
    egreso.observaciones || ""
  );
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState(
    egreso.subcategoria || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const {
    subcategorias,
    cargando,
    error,
    subcategoriasVisibles,
    seleccionarSubcategoria,
    resetearSeleccion,
    rutaSeleccion,
  } = useSubcategoriasEgresos();

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    const options = {
      timeZone: "America/Argentina/Buenos_Aires",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    return date.toLocaleDateString("es-AR", options);
  };

  const formatearImporte = (importe) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(importe);
  };

  const adjustTextareaHeight = (e) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleSeleccionarSubcategoria = (subcategoria) => {
    const tieneHijos = subcategorias.some(
      (sub) => sub.categoriaPadre === subcategoria.codigo
    );

    if (tieneHijos) {
      seleccionarSubcategoria(subcategoria);
    } else {
      setSubcategoriaSeleccionada({
        ...subcategoria,
        rutaSubcategoria: [...rutaSeleccion, subcategoria],
      });
      seleccionarSubcategoria(subcategoria);
    }
  };

  const handleResetear = () => {
    resetearSeleccion();
    setSubcategoriaSeleccionada(null);
  };

  const handleGuardar = async () => {
    try {
      setIsLoading(true);
      const egresoActualizado = {
        ...egreso,
        observaciones,
        subcategoria: subcategoriaSeleccionada,
      };
      await updateEgreso(egreso._id, egresoActualizado);
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="egresos-datos-adicionales-overlay">
      <div className="egresos-datos-adicionales-container">
        <p className="egresos-datos-adicionales-titulo">
          Egresos - Datos Adicionales
        </p>
        <div className="egresos-datos-content">
          <div className="egresos-dato-grupo">
            <label>Fecha:</label>
            <span>{formatearFecha(egreso.fecha)}</span>
          </div>
          <div className="egresos-dato-grupo">
            <label>Ruta Completa:</label>
            <span>
              {egreso.categoria.rutaCategoria
                .map((cat) => cat.nombre)
                .join(" > ")}
            </span>
          </div>
          <div className="egresos-dato-grupo">
            <label>Importe:</label>
            <span>{formatearImporte(egreso.importe)}</span>
          </div>
          <div className="egresos-dato-grupo">
            <label>Subcategoría:</label>
            {cargando ? (
              <span>Cargando subcategorías...</span>
            ) : error ? (
              <span className="egresos-error">{error}</span>
            ) : (
              <div className="egresos-subcategorias-navegacion">
                {subcategoriaSeleccionada && (
                  <div className="egresos-ruta-actual">
                    {subcategoriaSeleccionada.rutaSubcategoria.length > 1 && (
                      <button
                        className="egresos-btn-reset"
                        onClick={handleResetear}
                        title="Volver al inicio"
                      >
                        <FaUndo />
                      </button>
                    )}
                    {subcategoriaSeleccionada.rutaSubcategoria.map(
                      (sub, index) => (
                        <span key={sub.codigo}>
                          {sub.nombre}
                          {index <
                            subcategoriaSeleccionada.rutaSubcategoria.length -
                              1 && <FaChevronRight />}
                        </span>
                      )
                    )}
                  </div>
                )}

                <div className="egresos-subcategorias-grid">
                  {subcategoriasVisibles.map((sub) => (
                    <button
                      key={sub.codigo}
                      className={`egresos-btn-subcategoria ${
                        subcategoriaSeleccionada?.codigo === sub.codigo
                          ? "seleccionada"
                          : ""
                      }`}
                      onClick={() => handleSeleccionarSubcategoria(sub)}
                    >
                      {sub.nombre}
                    </button>
                  ))}
                </div>

                {subcategoriaSeleccionada &&
                  subcategoriaSeleccionada.rutaSubcategoria.length > 1 && (
                    <div className="egresos-subcategoria-seleccionada">
                      <span>✓ {subcategoriaSeleccionada.nombre}</span>
                      <small>
                        Subcategoría seleccionada - Puede guardar los cambios
                      </small>
                    </div>
                  )}
              </div>
            )}
          </div>
          <div className="egresos-dato-grupo">
            <label>Observaciones:</label>
            <textarea
              value={observaciones}
              onChange={(e) => {
                setObservaciones(e.target.value);
                adjustTextareaHeight(e);
              }}
              onInput={adjustTextareaHeight}
              className="egresos-observaciones-input"
              placeholder="Ingrese sus observaciones aquí..."
            />
          </div>
        </div>
        <div className="egresos-botones-container">
          <button
            className="egresos-btn-cancelar"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            className="egresos-btn-guardar"
            onClick={handleGuardar}
            disabled={isLoading}
          >
            {isLoading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
};

EgresosDatosAdicionales.propTypes = {
  egreso: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    fecha: PropTypes.string.isRequired,
    importe: PropTypes.number.isRequired,
    observaciones: PropTypes.string,
    categoria: PropTypes.shape({
      rutaCategoria: PropTypes.arrayOf(
        PropTypes.shape({
          nombre: PropTypes.string.isRequired,
        })
      ).isRequired,
    }).isRequired,
    subcategoria: PropTypes.shape({
      codigo: PropTypes.string,
      nombre: PropTypes.string,
      rutaSubcategoria: PropTypes.arrayOf(
        PropTypes.shape({
          codigo: PropTypes.string,
          nombre: PropTypes.string,
        })
      ),
    }),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};
