import { useState } from "react";
import PropTypes from "prop-types";
import { EntradaMonetaria } from "../../comunes/EntradaMonetaria";
import { EntradaFecha } from "../../comunes/EntradaFecha";
import { BotonesFormulario } from "./BotonesFormulario";
import { ListadoEgresos } from "./ListadoEgresos";
import "./FormularioEgreso.scss";

export const FormularioEgreso = ({ saldoAfectado, onGuardar, onCancelar }) => {
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split("T")[0],
    importe: "",
  });
  const [error, setError] = useState("");
  const [actualizarListado, setActualizarListado] = useState(false);
  const [ultimoEgresoId, setUltimoEgresoId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.importe || parseFloat(formData.importe) <= 0) {
      setError("El importe debe ser mayor a 0");
      return;
    }

    if (parseFloat(formData.importe) > saldoAfectado.saldo) {
      setError("El importe no puede superar el saldo disponible");
      return;
    }

    const egresoData = {
      fecha: formData.fecha,
      importe: parseFloat(formData.importe),
    };

    try {
      const nuevoEgreso = await onGuardar(egresoData);
      setUltimoEgresoId(nuevoEgreso._id);
      setActualizarListado((prev) => !prev);
      setFormData({
        fecha: new Date().toISOString().split("T")[0],
        importe: "",
      });

      setTimeout(() => {
        setUltimoEgresoId(null);
      }, 3000);
    } catch (error) {
      console.error("Error en el formulario:", error);
      setError(error.message || "Error al guardar el egreso");
    }
  };

  const formatearImporte = (importe) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(importe);
  };

  return (
    <div className="container-general">
      <div className="formulario-egreso-container">
        <h2 className="formulario-titulo">Registrar Egreso</h2>
        <div className="saldo-seleccionado">
          <span>Saldo a utilizar:</span>
          <div className="saldo-info">
            <span className="saldo-nombre">{saldoAfectado.nombre}</span>
            <span className="saldo-monto">
              {formatearImporte(saldoAfectado.saldo)}
            </span>
          </div>
        </div>
        {error && <div className="error-mensaje">{error}</div>}
        <form onSubmit={handleSubmit} className="formulario-egreso">
          <div className="campos-inline">
            <div className="campo-formulario">
              <label htmlFor="fecha">Fecha:</label>
              <EntradaFecha
                id="fecha"
                valor={formData.fecha}
                alCambiar={(valor) =>
                  setFormData((prev) => ({ ...prev, fecha: valor }))
                }
                requerido
              />
            </div>
            <div className="campo-formulario">
              <label htmlFor="importe">Importe:</label>
              <EntradaMonetaria
                valor={formData.importe}
                alCambiar={(valor) =>
                  setFormData((prev) => ({ ...prev, importe: valor }))
                }
                placeholder="0,00"
              />
            </div>
          </div>
          <BotonesFormulario onCancelar={onCancelar} />
        </form>
      </div>
      <ListadoEgresos key={actualizarListado} ultimoEgresoId={ultimoEgresoId} />
    </div>
  );
};

FormularioEgreso.propTypes = {
  saldoAfectado: PropTypes.shape({
    nombre: PropTypes.string.isRequired,
    saldo: PropTypes.number.isRequired,
    rutaCategoria: PropTypes.arrayOf(
      PropTypes.shape({
        codigo: PropTypes.string.isRequired,
        nombre: PropTypes.string.isRequired,
      })
    ).isRequired,
    categoriaId: PropTypes.string.isRequired,
  }).isRequired,
  onGuardar: PropTypes.func.isRequired,
  onCancelar: PropTypes.func.isRequired,
};
