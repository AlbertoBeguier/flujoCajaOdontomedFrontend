import PropTypes from "prop-types";
import { useState, useEffect, useCallback } from "react";
import "./FormFields.scss";

export const FormFields = ({
  formData,
  handleChange,
  subcategoriasIngresos,
  onRutaChange,
  onAbrirModalLista,
}) => {
  const [siguienteCodigo, setSiguienteCodigo] = useState("");
  const [subcategoriasNivel, setSubcategoriasNivel] = useState([]);
  const [rutaNavegacion, setRutaNavegacion] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState(new Set());

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
    // Efecto para la ruta de navegación y nivel
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

    // Actualizar nivel solo si es necesario
    const nuevoNivel = formData.categoriaPadre
      ? formData.categoriaPadre.split(".").length + 1
      : 1;

    if (formData.nivel !== nuevoNivel) {
      handleChange({
        target: {
          name: "nivel",
          value: nuevoNivel,
        },
      });
    }
  }, [
    formData.categoriaPadre,
    formData.nivel,
    subcategoriasIngresos,
    handleChange,
  ]);

  // Efecto separado para la actualización del código
  useEffect(() => {
    if (formData.categoriaPadre) {
      // Buscar si el padre es un item de lista
      const esItemLista = subcategoriasIngresos.some((sub) =>
        sub.lista?.items?.some(
          (item) => item.codigo === formData.categoriaPadre
        )
      );

      if (esItemLista) {
        // Si es item de lista, buscar el último número usado
        const parentCode = formData.categoriaPadre;
        const parentSubcategoria = subcategoriasIngresos.find((sub) =>
          sub.lista?.items?.some((item) => item.codigo === parentCode)
        );

        if (parentSubcategoria) {
          // Buscar el último número usado en subcategorías del item
          const subcategoriasDelItem = subcategoriasIngresos.filter(
            (sub) => sub.categoriaPadre === parentCode
          );

          const ultimoNumero =
            subcategoriasDelItem.length > 0
              ? Math.max(
                  ...subcategoriasDelItem.map((sub) =>
                    parseInt(sub.codigo.split(".").pop())
                  )
                )
              : 0;

          const nuevoCodigo = `${parentCode}.${ultimoNumero + 1}`;
          actualizarCodigo(nuevoCodigo);
        }
      } else {
        // Lógica existente para subcategorías normales
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
                  ...subcategorias.map((c) =>
                    parseInt(c.codigo.split(".").pop())
                  )
                )
              : 0;
          const nuevoCodigo = `${categoriaPadre.codigo}.${ultimoNumero + 1}`;
          actualizarCodigo(nuevoCodigo);
        }
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
  }, [formData.categoriaPadre, subcategoriasIngresos, actualizarCodigo]);

  useEffect(() => {
    // Mantener la actualización de subcategoriasNivel
    const subcategoriasDelNivel = subcategoriasIngresos.filter((c) =>
      formData.categoriaPadre
        ? c.categoriaPadre === formData.categoriaPadre
        : !c.categoriaPadre
    );
    setSubcategoriasNivel(subcategoriasDelNivel);
  }, [formData.categoriaPadre, subcategoriasIngresos]);

  const handleAgregarSubcategoria = (subcategoriaOItem) => {
    // Si el item viene de una lista
    if (!subcategoriaOItem.nivel && !subcategoriaOItem.categoriaPadre) {
      // Es un item de lista
      const parentSubcategoria = subcategoriasIngresos.find((sub) =>
        sub.lista?.items?.some(
          (item) => item.codigo === subcategoriaOItem.codigo
        )
      );

      if (parentSubcategoria) {
        // Construir la ruta completa incluyendo el item
        const ruta = [];
        let currentCode = parentSubcategoria.codigo;

        // Primero encontrar la ruta hasta el padre
        while (currentCode) {
          const parent = subcategoriasIngresos.find(
            (sub) => sub.codigo === currentCode
          );
          if (parent) {
            ruta.unshift(parent);
            currentCode = parent.categoriaPadre;
          } else {
            break;
          }
        }

        // Agregar el item como último elemento de la ruta
        ruta.push({
          _id: subcategoriaOItem._id,
          codigo: subcategoriaOItem.codigo,
          nombre: subcategoriaOItem.nombre,
          nivel: parentSubcategoria.nivel + 1,
        });

        // Actualizar la ruta en el componente padre
        onRutaChange(ruta);

        // Mantener el árbol expandido
        const newExpanded = new Set(expandedCategories);
        ruta.forEach((item) => newExpanded.add(item.codigo));
        setExpandedCategories(newExpanded);

        // Actualizar el formulario
        handleChange({
          target: {
            name: "categoriaPadre",
            value: subcategoriaOItem.codigo,
          },
        });
      }
    } else {
      // Es una subcategoría normal
      handleChange({
        target: {
          name: "categoriaPadre",
          value: subcategoriaOItem.codigo,
        },
      });
    }
  };

  const handleNavegar = (subcategoria) => {
    console.log("DEBUG - handleNavegar:", {
      subcategoria,
      rutaActual: rutaNavegacion.map((r) => r.codigo),
    });

    // Actualizar la ruta en el componente padre
    onRutaChange([...rutaNavegacion, subcategoria]);

    // Actualizar el formulario
    handleChange({
      target: {
        name: "categoriaPadre",
        value: subcategoria.codigo,
      },
    });
  };

  const toggleExpand = (subcategoria) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(subcategoria.codigo)) {
      newExpanded.delete(subcategoria.codigo);
    } else {
      newExpanded.add(subcategoria.codigo);
    }
    setExpandedCategories(newExpanded);
  };

  const mostrarSubcategorias = (subcategoria) => {
    // Obtener subcategorías, ya sean de una lista o normales
    let subItems = [];

    if (subcategoria.esLista && subcategoria.lista?.items?.length > 0) {
      // Si es una lista, usar sus items
      subItems = subcategoria.lista.items;
    } else {
      // Si no es lista, buscar subcategorías normales
      subItems = subcategoriasIngresos.filter(
        (c) => c.categoriaPadre === subcategoria.codigo
      );
    }

    const isExpanded = expandedCategories.has(subcategoria.codigo);

    return (
      <>
        <div className="categoria-acciones">
          {/* Estos botones deben aparecer SIEMPRE */}
          {subItems.length > 0 && (
            <button
              type="button"
              onClick={() => toggleExpand(subcategoria)}
              className="btn-navegar"
            >
              {isExpanded ? "Ocultar subcategorías" : "Ver subcategorías"}
            </button>
          )}
          {subcategoria.esLista ? (
            <button
              type="button"
              onClick={() => handleAbrirModalLista(subcategoria)}
              className="btn-agregar-subcategoria"
            >
              + Agregar a Lista
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleAgregarSubcategoria(subcategoria)}
              className="btn-agregar-subcategoria"
            >
              + Agregar Subcategoría
            </button>
          )}
        </div>

        {isExpanded && subItems.length > 0 && (
          <ul className="lista-subcategorias">
            {subItems.map((item) => (
              <li key={item._id} className="subcategoria-item">
                <div className="categoria-info">
                  <span className="categoria-codigo">{item.codigo}</span>
                  <span className="categoria-nombre">
                    {item.nombre}
                    {item.esLista && (
                      <span
                        className="lista-badge"
                        onClick={() => handleAbrirModalLista(item)}
                        role="button"
                        tabIndex={0}
                      >
                        Lista
                      </span>
                    )}
                  </span>
                </div>
                {mostrarSubcategorias(item)}{" "}
                {/* Recursión para mostrar más niveles */}
              </li>
            ))}
          </ul>
        )}
      </>
    );
  };

  const handleAbrirModalLista = (subcategoria) => {
    onAbrirModalLista(subcategoria);
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
                    {subcategoria.esLista && (
                      <span
                        className="lista-badge"
                        onClick={() => handleAbrirModalLista(subcategoria)}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleAbrirModalLista(subcategoria);
                          }
                        }}
                      >
                        Lista
                      </span>
                    )}
                  </span>
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
  onRutaChange: PropTypes.func.isRequired,
  onAbrirModalLista: PropTypes.func.isRequired,
};
