import { useState } from "react";
import PropTypes from "prop-types";
import { EntradaMonetaria } from "../../comunes/EntradaMonetaria";
import { EntradaFecha } from "../../comunes/EntradaFecha";
import { RutaCategoria } from "./RutaCategoria";
import { BotonesFormulario } from "./BotonesFormulario";
import "./FormularioIngreso.css";

export const FormularioIngreso = ({
  categoriaSeleccionada,
  rutaCompleta,
  onGuardar,
  onCancelar,
}) => {
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [importe, setImporte] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!importe || parseFloat(importe) <= 0) {
      setError("El importe debe ser mayor a 0");
      return;
    }

    const ingresoData = {
      fecha,
      importe: parseFloat(importe),
      categoria: {
        codigo: categoriaSeleccionada.codigo,
        nombre: categoriaSeleccionada.nombre,
        rutaCategoria: rutaCompleta,
      },
    };

    try {
      await onGuardar(ingresoData);
    } catch (error) {
      console.error("Error en el formulario:", error);
      setError(error.message || "Error al guardar el ingreso");
    }
  };

  return (
    <div className="formulario-ingreso-container">
      <h2 className="formulario-titulo">Registrar Ingreso</h2>
      <RutaCategoria rutaCompleta={rutaCompleta} />
      {error && <div className="error-mensaje">{error}</div>}
      <form onSubmit={handleSubmit} className="formulario-ingreso">
        <div className="campos-inline">
          <div className="campo-formulario">
            <label htmlFor="fecha">Fecha:</label>
            <EntradaFecha
              id="fecha"
              valor={fecha}
              alCambiar={setFecha}
              requerido
            />
          </div>
          <div className="campo-formulario">
            <label htmlFor="importe">Importe:</label>
            <EntradaMonetaria
              valor={importe}
              alCambiar={setImporte}
              placeholder="0,00"
            />
          </div>
        </div>
        <BotonesFormulario onCancelar={onCancelar} />
      </form>
    </div>
  );
};

FormularioIngreso.propTypes = {
  categoriaSeleccionada: PropTypes.shape({
    codigo: PropTypes.string.isRequired,
    nombre: PropTypes.string.isRequired,
  }).isRequired,
  rutaCompleta: PropTypes.arrayOf(
    PropTypes.shape({
      codigo: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
    })
  ).isRequired,
  onGuardar: PropTypes.func.isRequired,
  onCancelar: PropTypes.func.isRequired,
};
