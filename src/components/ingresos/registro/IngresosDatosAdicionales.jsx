import PropTypes from "prop-types";
import { useState } from "react";
import { updateIngreso } from "../../../services/ingresosService";
import "./IngresosDatosAdicionales.scss";

export const IngresosDatosAdicionales = ({ ingreso, onClose, onUpdate }) => {
  const [observaciones, setObservaciones] = useState(
    ingreso.observaciones || ""
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
      const ingresoActualizado = { ...ingreso, observaciones };
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
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};
