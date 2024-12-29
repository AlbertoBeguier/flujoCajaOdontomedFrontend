import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaPlus, FaTrash } from "react-icons/fa";
import { getSubcategoriasIngresos } from "../../../services/subcategoriaIngresosService";
import "./GestionLista.scss";

export const GestionLista = ({ subcategoria, onGuardar, onCerrar }) => {
  const [lista, setLista] = useState({
    nombre: "",
    items: [],
  });
  const [nuevoItem, setNuevoItem] = useState({ nombre: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [rutaActual, setRutaActual] = useState([]);

  useEffect(() => {
    const inicializarModal = async () => {
      try {
        const response = await getSubcategoriasIngresos();

        // Siempre construir la ruta completa
        const rutaCompleta = construirRuta(subcategoria.codigo, response);
        setRutaActual(rutaCompleta);

        // Si la categoría actual tiene lista, mostrarla
        const categoriaActual = response.find(
          (cat) => cat.codigo === subcategoria.codigo
        );
        if (categoriaActual?.lista?.items?.length > 0) {
          setLista({
            nombre: categoriaActual.lista.nombre || categoriaActual.nombre,
            items: categoriaActual.lista.items,
          });
          setCategorias(categoriaActual.lista.items);
        } else {
          // Si no tiene lista, mostrar categorías raíz
          const categoriasRaiz = response.filter((cat) => !cat.categoriaPadre);
          setCategorias(categoriasRaiz);
        }
      } catch (error) {
        console.error("Error al inicializar modal:", error);
      }
    };

    inicializarModal();
  }, [subcategoria]);

  // Función auxiliar para construir la ruta completa
  const construirRuta = (codigo, todasLasCategorias) => {
    const ruta = [];
    let codigoActual = codigo;

    while (codigoActual) {
      const categoria = todasLasCategorias.find(
        (cat) => cat.codigo === codigoActual
      );
      if (categoria) {
        ruta.unshift(categoria);
        codigoActual = categoria.categoriaPadre;
      } else {
        break;
      }
    }

    return ruta;
  };

  const handleSeleccionCategoria = async (categoria) => {
    const nivelActual =
      categoria.codigo?.split(".").length || rutaActual.length + 1;
    const yaExisteNivel = rutaActual.some(
      (cat) => cat.codigo.split(".").length === nivelActual
    );

    if (
      !yaExisteNivel &&
      !rutaActual.find((cat) => cat.codigo === categoria.codigo)
    ) {
      const categoriaActualizada = {
        ...categoria,
        codigo:
          categoria.codigo ||
          `${rutaActual[rutaActual.length - 1].codigo}.${
            lista.items.indexOf(categoria) + 1
          }`,
        nivel: nivelActual,
        esLista: categoria.esLista || false,
      };

      setRutaActual([...rutaActual, categoriaActualizada]);

      if (categoria.esLista) {
        // Si es una lista, mostrar sus items
        if (categoria.lista?.items?.length > 0) {
          setCategorias(categoria.lista.items);
          setLista({
            nombre: categoria.nombre,
            items: categoria.lista.items,
          });
        } else {
          // Si es lista pero no tiene items, mostrar lista vacía
          setCategorias([]);
          setLista({
            nombre: categoria.nombre,
            items: [],
          });
        }
      } else {
        // Si es una categoría normal, mostrar sus subcategorías
        const subCategorias = await getSubcategoriasIngresos();
        const hijos = subCategorias.filter(
          (sub) => sub.categoriaPadre === categoria.codigo
        );
        setCategorias(hijos);
        setLista({
          nombre: categoria.nombre,
          items: [],
        });
      }
    }
  };

  const handleAgregarItem = () => {
    if (!nuevoItem.nombre) return;

    setLista((prevLista) => ({
      ...prevLista,
      items: [
        ...prevLista.items,
        {
          nombre: nuevoItem.nombre,
          activo: true,
        },
      ],
    }));
    setNuevoItem({ nombre: "" });
  };

  const handleEliminarItem = (index) => {
    setLista((prevLista) => ({
      ...prevLista,
      items: prevLista.items.filter((_, i) => i !== index),
    }));
  };

  const handleGuardar = async () => {
    try {
      setIsLoading(true);
      const codigoBase =
        rutaActual.length > 0
          ? rutaActual[rutaActual.length - 1].codigo
          : subcategoria.codigo;

      if (!codigoBase) {
        throw new Error("No se pudo determinar el código base para la lista");
      }

      await onGuardar({
        ...lista,
        codigoBase,
        nombre: lista.nombre || subcategoria.nombre,
      });
    } catch (error) {
      console.error("Error al guardar la lista:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleVolver = () => {
    if (rutaActual.length > 0) {
      // Quitar el último elemento de la ruta
      const nuevaRuta = rutaActual.slice(0, -1);
      setRutaActual(nuevaRuta);

      // Cargar las categorías del nivel anterior
      const cargarCategoriasAnteriores = async () => {
        const response = await getSubcategoriasIngresos();
        if (nuevaRuta.length === 0) {
          // Si volvimos al inicio, mostrar categorías raíz y limpiar lista
          const categoriasRaiz = response.filter((cat) => !cat.categoriaPadre);
          setCategorias(categoriasRaiz);
          setLista({ nombre: "", items: [] }); // Limpiar la lista
        } else {
          // Mostrar las subcategorías del último elemento en la nueva ruta
          const ultimaCategoria = nuevaRuta[nuevaRuta.length - 1];

          // Si la última categoría es una lista, mostrar sus items
          if (
            ultimaCategoria.esLista &&
            ultimaCategoria.lista?.items?.length > 0
          ) {
            setLista({
              nombre: ultimaCategoria.lista.nombre || ultimaCategoria.nombre,
              items: ultimaCategoria.lista.items,
            });
          } else {
            // Si no es lista, mostrar subcategorías y limpiar lista
            const hijos = response.filter(
              (sub) => sub.categoriaPadre === ultimaCategoria.codigo
            );
            setCategorias(hijos);
            setLista({ nombre: "", items: [] }); // Limpiar la lista
          }
        }
      };
      cargarCategoriasAnteriores();
    }
  };

  const handleItemClick = (item) => {
    if (item.esLista) {
      handleSeleccionCategoria({
        codigo:
          item.codigo ||
          `${rutaActual[rutaActual.length - 1].codigo}.${
            lista.items.indexOf(item) + 1
          }`,
        nombre: item.nombre,
        nivel: rutaActual.length + 1,
        esLista: true,
        lista: item.lista,
      });
    }
  };

  return (
    <div className="datos-adicionales-overlay">
      <div className="datos-adicionales-container">
        <div className="navegacion">
          <div className="ruta-actual">
            {rutaActual.map((cat, index) => (
              <span key={cat.codigo} className="ruta-item">
                {cat.nombre}
                {index < rutaActual.length - 1 && " > "}
              </span>
            ))}
            {rutaActual.length > 0 && (
              <button className="btn-volver" onClick={handleVolver}>
                Volver
              </button>
            )}
          </div>
          <div className="lista-categorias">
            {categorias.map((cat) => (
              <div
                key={cat.codigo}
                className="categoria-item"
                onClick={() => handleSeleccionCategoria(cat)}
              >
                {cat.nombre}
              </div>
            ))}
          </div>
        </div>

        <h3>
          Lista de{" "}
          {rutaActual[rutaActual.length - 1]?.nombre || subcategoria.nombre}
        </h3>

        <div className="datos-content">
          <div className="formulario-item">
            <div className="dato-grupo">
              <label>Nombre del ítem:</label>
              <input
                type="text"
                value={nuevoItem.nombre}
                onChange={(e) => setNuevoItem({ nombre: e.target.value })}
                placeholder="Ingrese el nombre del ítem"
              />
            </div>
            <button onClick={handleAgregarItem}>
              <FaPlus /> Agregar
            </button>
          </div>

          <div className="lista-items">
            {lista.items.map((item, index) => (
              <div key={index} className="item">
                <div
                  className="item-info"
                  onClick={() => handleItemClick(item)}
                  style={{ cursor: "pointer" }}
                >
                  <span className="numero">{index + 1}</span>
                  <span className="nombre">{item.nombre}</span>
                </div>
                <button onClick={() => handleEliminarItem(index)}>
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="botones-container">
          <button
            className="btn-cancelar"
            onClick={onCerrar}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            className="btn-guardar"
            onClick={handleGuardar}
            disabled={isLoading}
          >
            {isLoading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
};

GestionLista.propTypes = {
  subcategoria: PropTypes.shape({
    _id: PropTypes.string,
    codigo: PropTypes.string.isRequired,
    nombre: PropTypes.string.isRequired,
    nivel: PropTypes.number.isRequired,
    categoriaPadre: PropTypes.string,
    lista: PropTypes.object,
    origenModal: PropTypes.oneOf(["botonPrincipal", "botonLista"]).isRequired,
  }).isRequired,
  onGuardar: PropTypes.func.isRequired,
  onCerrar: PropTypes.func.isRequired,
};
