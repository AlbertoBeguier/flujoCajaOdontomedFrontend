import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { FormularioSubcategoriaIngresos } from "./FormularioSubcategoriaIngresos";
import { GestionLista } from "./GestionLista";

export const SubcategoriasIngresos = ({ subcategorias, onActualizar }) => {
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
    <div>
      <button onClick={handleAgregarSubcategoria}>Agregar Subcategoría</button>

      {mostrarFormulario && (
        <FormularioSubcategoriaIngresos
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

SubcategoriasIngresos.propTypes = {
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

SubcategoriasIngresos.defaultProps = {
  onActualizar: () => {},
};
