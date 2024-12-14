import PropTypes from "prop-types";

export const BotonesFormulario = ({ onCancelar }) => {
  return (
    <div className="botones-formulario">
      <button type="button" className="boton-cancelar" onClick={onCancelar}>
        Cancelar
      </button>
      <button type="submit" className="boton-guardar">
        Guardar
      </button>
    </div>
  );
};

BotonesFormulario.propTypes = {
  onCancelar: PropTypes.func.isRequired,
};
