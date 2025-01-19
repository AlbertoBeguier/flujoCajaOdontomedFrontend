import { useState } from "react";
import PropTypes from "prop-types";
import { EntradaMonetaria } from "../../comunes/EntradaMonetaria";
import { EntradaFecha } from "../../comunes/EntradaFecha";
import { RutaCategoria } from "./RutaCategoria";
import { BotonesFormulario } from "./BotonesFormulario";
import { ListadoIngresos } from "./ListadoIngresos";
import "./FormularioIngreso.scss";

export const FormularioIngreso = ({
  categoriaSeleccionada,
  rutaCompleta,
  onGuardar,
  onCancelar,
}) => {
  const [fecha, setFecha] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });
  const [importe, setImporte] = useState("");
  const [error, setError] = useState("");
  const [actualizarListado, setActualizarListado] = useState(false);
  const [ultimoIngresoId, setUltimoIngresoId] = useState(null);

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
      const nuevoIngreso = await onGuardar(ingresoData);
      setUltimoIngresoId(nuevoIngreso._id);
      setActualizarListado((prev) => !prev);
      setImporte("");

      setTimeout(() => {
        setUltimoIngresoId(null);
      }, 3000);
    } catch (error) {
      console.error("Error en el formulario:", error);
      setError(error.message || "Error al guardar el ingreso");
    }
  };

  return (
    <div className="container-general-formulario-ingreso">
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
      <ListadoIngresos
        key={actualizarListado}
        ultimoIngresoId={ultimoIngresoId}
      />
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
