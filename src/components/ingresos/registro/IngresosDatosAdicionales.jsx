import PropTypes from "prop-types";
import { useState } from "react";
import { updateIngreso } from "../../../services/ingresosService";
import { useSubcategoriasIngresos } from "../../../hooks/useSubcategoriasIngresos";
import { FaChevronRight, FaUndo } from "react-icons/fa";
import "./IngresosDatosAdicionales.scss";

export const IngresosDatosAdicionales = ({ ingreso, onClose, onUpdate }) => {
  const [observaciones, setObservaciones] = useState(
    ingreso.observaciones || ""
  );
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState(
    ingreso.subcategoria || null
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
  } = useSubcategoriasIngresos();

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
      const ingresoActualizado = {
        ...ingreso,
        observaciones,
        subcategoria: subcategoriaSeleccionada,
      };
      await updateIngreso(ingreso._id, ingresoActualizado);
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="datos-adicionales-overlay">
      <div className="datos-adicionales-container">
        <p>Ingresos - Datos Adicionales</p>
        <div className="datos-content">
          <div className="dato-grupo">
            <label>Fecha:</label>
            <span>{formatearFecha(ingreso.fecha)}</span>
          </div>
          <div className="dato-grupo">
            <label>Ruta Completa:</label>
            <span>
              {ingreso.categoria.rutaCategoria
                .map((cat) => cat.nombre)
                .join(" > ")}
            </span>
          </div>
          <div className="dato-grupo">
            <label>Importe:</label>
            <span>{formatearImporte(ingreso.importe)}</span>
          </div>
          <div className="dato-grupo">
            <label>Subcategoría:</label>
            {cargando ? (
              <span>Cargando subcategorías...</span>
            ) : error ? (
              <span className="error">{error}</span>
            ) : (
              <div className="subcategorias-navegacion">
                {subcategoriaSeleccionada && (
                  <div className="ruta-actual">
                    {subcategoriaSeleccionada.rutaSubcategoria.length > 1 && (
                      <button
                        className="btn-reset"
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

                <div className="subcategorias-grid">
                  {subcategoriasVisibles.map((sub) => (
                    <button
                      key={sub.codigo}
                      className={`btn-subcategoria ${
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
                    <div className="subcategoria-seleccionada">
                      <span>✓ {subcategoriaSeleccionada.nombre}</span>
                      <small>
                        Subcategoría seleccionada - Puede guardar los cambios
                      </small>
                    </div>
                  )}
              </div>
            )}
          </div>
          <div className="dato-grupo">
            <label>Observaciones:</label>
            <textarea
              value={observaciones}
              onChange={(e) => {
                setObservaciones(e.target.value);
                adjustTextareaHeight(e);
              }}
              onInput={adjustTextareaHeight}
              className="observaciones-input"
              placeholder="Ingrese sus observaciones aquí..."
            />
          </div>
        </div>
        <div className="botones-container">
          <button
            className="btn-cancelar"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            className="btn-guardar"
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

IngresosDatosAdicionales.propTypes = {
  ingreso: PropTypes.shape({
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
