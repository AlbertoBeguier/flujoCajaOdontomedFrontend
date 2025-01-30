import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { FormularioSubcategoriaEgresos } from "./FormularioSubcategoriaEgresos";
import { GestionLista } from "./GestionLista";

export const SubcategoriasEgresos = ({ subcategorias, onActualizar }) => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarModalLista, setMostrarModalLista] = useState(false);
  const [rutaActual, setRutaActual] = useState([]);

  const handleAgregarSubcategoria = useCallback(() => {
    const subcategoriaActual = rutaActual[rutaActual.length - 1];

    if (subcategoriaActual?.esLista) {
      setMostrarModalLista(true);
    } else {
      setMostrarFormulario(true);
    }
  }, [rutaActual]);

  const handleSubcategoriaCreada = () => {
    setMostrarFormulario(false);
    if (onActualizar) onActualizar();
  };

  const handleCerrarModalLista = () => {
    setMostrarModalLista(false);
    if (onActualizar) onActualizar();
  };

  const handleRutaChange = (nuevaRuta) => {
    setRutaActual(nuevaRuta);
  };

  return (
    <div className="egresos-subcategorias-container">
      <button
        className="egresos-btn-agregar"
        onClick={handleAgregarSubcategoria}
      >
        Agregar Subcategoría
      </button>

      {mostrarFormulario && (
        <FormularioSubcategoriaEgresos
          onSubcategoriaCreada={handleSubcategoriaCreada}
          subcategorias={subcategorias}
          rutaActual={rutaActual}
          onRutaChange={handleRutaChange}
        />
      )}

      {mostrarModalLista && (
        <GestionLista
          onCerrar={handleCerrarModalLista}
          subcategorias={subcategorias}
          rutaActual={rutaActual}
          onRutaChange={handleRutaChange}
        />
      )}
    </div>
  );
};

SubcategoriasEgresos.propTypes = {
  subcategorias: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      codigo: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
      nivel: PropTypes.number.isRequired,
      categoriaPadre: PropTypes.string,
      esLista: PropTypes.bool,
    })
  ).isRequired,
  onActualizar: PropTypes.func,
};

SubcategoriasEgresos.defaultProps = {
  onActualizar: () => {},
};
