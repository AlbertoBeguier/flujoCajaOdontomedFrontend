import PropTypes from "prop-types";
import { useState, useEffect, useCallback } from "react";
import "./FormFields.scss";

export const FormFields = ({
  formData,
  handleChange,
  subcategoriasIngresos,
}) => {
  const [siguienteCodigo, setSiguienteCodigo] = useState("");
  const [subcategoriasNivel, setSubcategoriasNivel] = useState([]);
  const [rutaNavegacion, setRutaNavegacion] = useState([]);

  const actualizarCodigo = useCallback(
    (nuevoCodigo) => {
      setSiguienteCodigo(nuevoCodigo);
      if (formData.codigo !== nuevoCodigo) {
        handleChange({
          target: {
            name: "codigo",
            value: nuevoCodigo,
          },
        });
      }
    },
    [formData.codigo, handleChange]
  );

  useEffect(() => {
    // Actualizar ruta de navegación
    if (formData.categoriaPadre) {
      const ruta = [];
      let subcategoriaActual = subcategoriasIngresos.find(
        (c) => c.codigo === formData.categoriaPadre
      );

      while (subcategoriaActual) {
        ruta.unshift(subcategoriaActual);
        subcategoriaActual = subcategoriasIngresos.find(
          (c) => c.codigo === subcategoriaActual.categoriaPadre
        );
      }

      setRutaNavegacion(ruta);
    } else {
      setRutaNavegacion([]);
    }

    // Generar siguiente código
    if (formData.categoriaPadre) {
      const categoriaPadre = subcategoriasIngresos.find(
        (c) => c.codigo === formData.categoriaPadre
      );
      if (categoriaPadre) {
        const subcategorias = subcategoriasIngresos.filter(
          (c) => c.categoriaPadre === formData.categoriaPadre
        );
        const ultimoNumero =
          subcategorias.length > 0
            ? Math.max(
                ...subcategorias.map((c) => parseInt(c.codigo.split(".").pop()))
              )
            : 0;
        const nuevoCodigo = `${categoriaPadre.codigo}.${ultimoNumero + 1}`;
        actualizarCodigo(nuevoCodigo);
      }
    } else {
      const subcategoriasNivel1 = subcategoriasIngresos.filter(
        (c) => !c.categoriaPadre
      );
      const ultimoNumero =
        subcategoriasNivel1.length > 0
          ? Math.max(...subcategoriasNivel1.map((c) => parseInt(c.codigo)))
          : 0;
      const nuevoCodigo = `${ultimoNumero + 1}`;
      actualizarCodigo(nuevoCodigo);
    }

    // Actualizar lista de subcategorías del nivel actual
    const subcategoriasDelNivel = subcategoriasIngresos.filter((c) =>
      formData.categoriaPadre
        ? c.categoriaPadre === formData.categoriaPadre
        : !c.categoriaPadre
    );
    setSubcategoriasNivel(subcategoriasDelNivel);
  }, [formData.categoriaPadre, subcategoriasIngresos, actualizarCodigo]);

  const handleAgregarSubcategoria = (subcategoria) => {
    handleChange({
      target: {
        name: "categoriaPadre",
        value: subcategoria.codigo,
      },
    });
  };

  const handleNavegar = (subcategoria) => {
    handleChange({
      target: {
        name: "categoriaPadre",
        value: subcategoria.codigo,
      },
    });
  };

  const mostrarSubcategorias = (subcategoria) => {
    const subsubcategorias = subcategoriasIngresos.filter(
      (c) => c.categoriaPadre === subcategoria.codigo
    );
    return (
      subsubcategorias.length > 0 && (
        <ul className="lista-subcategorias">
          {subsubcategorias.map((subcat) => (
            <li key={subcat._id} className="subcategoria-item">
              <div className="categoria-info">
                <span className="categoria-codigo">{subcat.codigo}</span>
                <span className="categoria-nombre">{subcat.nombre}</span>
              </div>
              <div className="categoria-acciones">
                <button
                  type="button"
                  onClick={() => handleNavegar(subcat)}
                  className="btn-navegar"
                >
                  Ver subcategorías
                </button>
                <button
                  type="button"
                  onClick={() => handleAgregarSubcategoria(subcat)}
                  className="btn-agregar-subcategoria"
                >
                  + Agregar Subcategoría
                </button>
              </div>
            </li>
          ))}
        </ul>
      )
    );
  };

  return (
    <div className="form-fields-container">
      {rutaNavegacion.length > 0 && (
        <div className="ruta-navegacion">
          <button
            type="button"
            onClick={() =>
              handleChange({
                target: { name: "categoriaPadre", value: "" },
              })
            }
            className="btn-navegacion"
          >
            Inicio
          </button>
          {rutaNavegacion.map((cat) => (
            <span key={cat._id}>
              <span className="separador-ruta">›</span>
              <button
                type="button"
                onClick={() => handleNavegar(cat)}
                className="btn-navegacion"
              >
                {cat.nombre}
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="form-group">
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="form-input"
          placeholder="Nombre de la subcategoría"
          required
        />
        <div className="codigo-sugerido">Código: {siguienteCodigo}</div>
      </div>

      {subcategoriasNivel.length > 0 && (
        <div className="subcategorias-nivel">
          <ul className="lista-subcategorias">
            {subcategoriasNivel.map((subcategoria) => (
              <li key={subcategoria._id} className="subcategoria-item">
                <div className="categoria-info">
                  <span className="categoria-codigo">
                    {subcategoria.codigo}
                  </span>
                  <span className="categoria-nombre">
                    {subcategoria.nombre}
                  </span>
                </div>
                <div className="categoria-acciones">
                  <button
                    type="button"
                    onClick={() => handleAgregarSubcategoria(subcategoria)}
                    className="btn-agregar-subcategoria"
                  >
                    + Agregar Subcategoría
                  </button>
                </div>
                {mostrarSubcategorias(subcategoria)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

FormFields.propTypes = {
  formData: PropTypes.shape({
    codigo: PropTypes.string,
    nombre: PropTypes.string.isRequired,
    nivel: PropTypes.number,
    categoriaPadre: PropTypes.string,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  subcategoriasIngresos: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      codigo: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
      nivel: PropTypes.number.isRequired,
      categoriaPadre: PropTypes.string,
    })
  ).isRequired,
};
