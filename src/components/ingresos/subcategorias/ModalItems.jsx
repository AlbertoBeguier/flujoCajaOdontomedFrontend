import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaPlus, FaPencilAlt } from "react-icons/fa";
import "./ModalItems.scss";
import { actualizarItem } from "../../../services/subcategoriaIngresosService";

export const ModalItems = ({
  subcategoria,
  onGuardar,
  onCerrar,
  subcategoriasIngresos,
}) => {
  const [items, setItems] = useState([]);
  const [nuevoItem, setNuevoItem] = useState("");
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [nombreEditado, setNombreEditado] = useState("");

  // Cargar items existentes al abrir el modal
  useEffect(() => {
    // Filtrar las subcategorías que son items de esta lista
    const itemsExistentes = subcategoriasIngresos
      .filter((sub) => sub.categoriaPadre === subcategoria.codigo)
      .map((sub) => ({
        nombre: sub.nombre,
        codigo: sub.codigo,
      }));

    setItems(itemsExistentes);
  }, [subcategoria, subcategoriasIngresos]);

  const handleAgregarItem = () => {
    if (!nuevoItem.trim()) return;

    // Verificar si ya existe un item con ese nombre
    if (
      items.some(
        (item) => item.nombre.toLowerCase() === nuevoItem.trim().toLowerCase()
      )
    ) {
      alert("Ya existe un item con ese nombre");
      return;
    }

    setItems([...items, { nombre: nuevoItem.trim() }]);
    setNuevoItem("");
  };

  const handleEditarItem = (index, item) => {
    setEditandoIndex(index);
    setNombreEditado(item.nombre);
  };

  const handleGuardarEdicion = async (index) => {
    if (!nombreEditado.trim()) return;

    if (
      items.some(
        (item, i) =>
          i !== index &&
          item.nombre.toLowerCase() === nombreEditado.trim().toLowerCase()
      )
    ) {
      alert("Ya existe un item con ese nombre");
      return;
    }

    try {
      const itemEditado = items[index];
      if (itemEditado.codigo) {
        // Si el item ya existe, actualizarlo
        await actualizarItem(itemEditado.codigo, nombreEditado.trim());
        window.location.reload();
      } else {
        // Si es un item nuevo, solo actualizar el estado
        const nuevosItems = [...items];
        nuevosItems[index] = {
          ...nuevosItems[index],
          nombre: nombreEditado.trim(),
        };
        setItems(nuevosItems);
      }
      setEditandoIndex(null);
      setNombreEditado("");
    } catch (error) {
      console.error("Error al guardar edición:", error);
      alert("Error al guardar el cambio");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Items de {subcategoria.nombre}</h2>

        {/* Mostrar items existentes */}
        <div className="items-existentes">
          <h3>Items Actuales:</h3>
          <div className="items-list">
            {items.map((item, index) => (
              <div key={item.codigo || index} className="item existing">
                {editandoIndex === index ? (
                  <div className="edit-container">
                    <input
                      type="text"
                      value={nombreEditado}
                      onChange={(e) => setNombreEditado(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") handleGuardarEdicion(index);
                      }}
                    />
                    <button onClick={() => handleGuardarEdicion(index)}>
                      Guardar
                    </button>
                  </div>
                ) : (
                  <>
                    <span>{item.nombre}</span>
                    <button onClick={() => handleEditarItem(index, item)}>
                      <FaPencilAlt />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="separador"></div>

        {/* Formulario para agregar nuevos items */}
        <h3>Agregar Nuevo Item:</h3>
        <div className="input-container">
          <input
            type="text"
            value={nuevoItem}
            onChange={(e) => setNuevoItem(e.target.value)}
            placeholder="Nombre del nuevo item"
          />
          <button onClick={handleAgregarItem}>
            <FaPlus /> Agregar
          </button>
        </div>

        <div className="buttons-container">
          <button className="btn-cancelar" onClick={onCerrar}>
            Cancelar
          </button>
          <button
            className="btn-guardar"
            onClick={() => onGuardar(items.filter((item) => !item.codigo))}
          >
            Guardar Nuevos Items
          </button>
        </div>
      </div>
    </div>
  );
};

ModalItems.propTypes = {
  subcategoria: PropTypes.shape({
    _id: PropTypes.string,
    codigo: PropTypes.string.isRequired,
    nombre: PropTypes.string.isRequired,
    nivel: PropTypes.number.isRequired,
    categoriaPadre: PropTypes.string,
  }).isRequired,
  subcategoriasIngresos: PropTypes.array.isRequired,
  onGuardar: PropTypes.func.isRequired,
  onCerrar: PropTypes.func.isRequired,
};
