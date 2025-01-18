import PropTypes from "prop-types";

export const RutaCategoria = ({ rutaCompleta }) => {
  return (
    <div className="ruta-categoria">
      {rutaCompleta.map((cat, index) => (
        <span key={cat.codigo}>
          {index > 0 ? " → " : ""}
          {cat.nombre}
        </span>
      ))}
    </div>
  );
};

RutaCategoria.propTypes = {
  rutaCompleta: PropTypes.arrayOf(
    PropTypes.shape({
      codigo: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
    })
  ).isRequired,
};
