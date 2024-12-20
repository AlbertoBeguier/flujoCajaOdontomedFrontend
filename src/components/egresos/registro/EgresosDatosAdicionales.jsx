import PropTypes from "prop-types";
import { useState } from "react";
import { updateEgreso } from "../../../services/egresosService";
import "./EgresosDatosAdicionales.scss";

export const EgresosDatosAdicionales = ({ egreso, onClose, onUpdate }) => {
  const [observaciones, setObservaciones] = useState(
    egreso.observaciones || ""
  );
  const [isLoading, setIsLoading] = useState(false);

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

  const handleGuardar = async () => {
    try {
      setIsLoading(true);
      const egresoActualizado = { ...egreso, observaciones };
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
    <div className="datos-adicionales-overlay">
      <div className="datos-adicionales-container">
        <p>Egresos - Datos Adicionales</p>
        <div className="datos-content">
          <div className="dato-grupo">
            <label>Fecha:</label>
            <span>{formatearFecha(egreso.fecha)}</span>
          </div>
          <div className="dato-grupo">
            <label>Ruta Completa:</label>
            <span>
              {egreso.categoria.rutaCategoria
                .map((cat) => cat.nombre)
                .join(" > ")}
            </span>
          </div>
          <div className="dato-grupo">
            <label>Importe:</label>
            <span>{formatearImporte(egreso.importe)}</span>
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
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};
