import { useState } from "react";
import PropTypes from "prop-types";
import { EntradaMonetaria } from "../../comunes/EntradaMonetaria";
import { EntradaFecha } from "../../comunes/EntradaFecha";
import { RutaCategoria } from "./RutaCategoria";
import { BotonesFormulario } from "./BotonesFormulario";
import { ListadoEgresos } from "./ListadoEgresos";
import "./FormularioEgreso.scss";

export const FormularioEgreso = ({
  categoriaSeleccionada,
  rutaCompleta,
  onGuardar,
  onCancelar,
}) => {
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split("T")[0],
    importe: "",
    metodoPago: "",
  });
  const [error, setError] = useState("");
  const [actualizarListado, setActualizarListado] = useState(false);
  const [ultimoEgresoId, setUltimoEgresoId] = useState(null);

  const metodosValidos = [
    { id: "efectivo", nombre: "Efectivo" },
    { id: "electronico", nombre: "Electrónico" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.importe || parseFloat(formData.importe) <= 0) {
      setError("El importe debe ser mayor a 0");
      return;
    }

    if (!formData.metodoPago) {
      setError("Debe seleccionar un método de pago");
      return;
    }

    const egresoData = {
      fecha: formData.fecha,
      importe: parseFloat(formData.importe),
      metodoPago: formData.metodoPago,
      categoria: {
        codigo: categoriaSeleccionada.codigo,
        nombre: categoriaSeleccionada.nombre,
        rutaCategoria: rutaCompleta,
      },
    };

    try {
      const nuevoEgreso = await onGuardar(egresoData);
      setUltimoEgresoId(nuevoEgreso._id);
      setActualizarListado((prev) => !prev);
      setFormData((prev) => ({
        ...prev,
        importe: "",
        metodoPago: "",
      }));

      setTimeout(() => {
        setUltimoEgresoId(null);
      }, 3000);
    } catch (error) {
      console.error("Error en el formulario:", error);
      setError(error.message || "Error al guardar el egreso");
    }
  };

  return (
    <div className="container-general">
      <div className="formulario-egreso-container">
        <h2 className="formulario-titulo">Registrar Gasto</h2>
        <RutaCategoria rutaCompleta={rutaCompleta} />
        {error && <div className="error-mensaje">{error}</div>}
        <form onSubmit={handleSubmit} className="formulario-egreso">
          <div className="campos-inline">
            <div className="campo-formulario">
              <label htmlFor="fecha">Fecha:</label>
              <EntradaFecha
                id="fecha"
                valor={formData.fecha}
                alCambiar={setFormData}
                name="fecha"
                requerido
              />
            </div>
            <div className="campo-formulario">
              <label htmlFor="importe">Importe:</label>
              <EntradaMonetaria
                valor={formData.importe}
                alCambiar={setFormData}
                name="importe"
                placeholder="0,00"
              />
            </div>
          </div>
          <div className="campo-formulario">
            <label htmlFor="metodoPago">Método de Pago:</label>
            <select
              id="metodoPago"
              name="metodoPago"
              value={formData.metodoPago}
              onChange={handleInputChange}
              required
              className="selector-metodo-pago"
            >
              <option value="">Seleccione método de pago</option>
              {metodosValidos.map((metodo) => (
                <option key={metodo.id} value={metodo.id}>
                  {metodo.nombre}
                </option>
              ))}
            </select>
          </div>
          <BotonesFormulario onCancelar={onCancelar} />
        </form>
      </div>
      <ListadoEgresos key={actualizarListado} ultimoEgresoId={ultimoEgresoId} />
    </div>
  );
};

FormularioEgreso.propTypes = {
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
