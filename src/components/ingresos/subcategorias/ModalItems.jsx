import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaPlus, FaPencilAlt, FaSave, FaTimes } from "react-icons/fa";
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
        <button className="btn-close" onClick={onCerrar}>
          <FaTimes />
        </button>
        <p>Items de {subcategoria.nombre}</p>

        {/* Mostrar items existentes */}
        <div className="items-existentes">
          <p className="agregar-nuevo-item">Items Actuales:</p>
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
                    <button
                      className="btn-save-icon"
                      onClick={() => handleGuardarEdicion(index)}
                    >
                      <FaSave />
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
        <p className="agregar-nuevo-item">Agregar Nuevo Item:</p>
        <div className="input-container">
          <input
            type="text"
            value={nuevoItem}
            onChange={(e) => setNuevoItem(e.target.value)}
            placeholder="Nombre del nuevo item"
          />
          <button
            className="btn-icon"
            onClick={handleAgregarItem}
            title="Agregar"
          >
            <FaPlus />
          </button>
        </div>

        <div className="buttons-container">
          <button
            className="btn-icon cancel"
            onClick={onCerrar}
            title="Cancelar"
          >
            <FaTimes />
          </button>
          <button
            className="btn-save-icon main-save"
            onClick={() => onGuardar(items.filter((item) => !item.codigo))}
            title="Guardar Nuevos Items"
          >
            <FaSave />
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
