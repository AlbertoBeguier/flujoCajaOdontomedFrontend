import PropTypes from "prop-types";
import "./EntradaFecha.scss";

export const EntradaFecha = ({ id, valor, alCambiar, requerido = false }) => {
  return (
    <input
      type="date"
      id={id}
      value={valor}
      onChange={(e) => alCambiar(e.target.value)}
      required={requerido}
      className="entrada-fecha"
    />
  );
};

EntradaFecha.propTypes = {
  id: PropTypes.string.isRequired,
  valor: PropTypes.string.isRequired,
  alCambiar: PropTypes.func.isRequired,
  requerido: PropTypes.bool,
};
