import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaPlus, FaPencilAlt, FaSave, FaTimes } from "react-icons/fa";
import "./ModalItems.scss";
import { actualizarItem } from "../../../services/subcategoriaEgresosService";

export const ModalItems = ({
  subcategoria,
  onGuardar,
  onCerrar,
  subcategoriasEgresos,
}) => {
  const [items, setItems] = useState([]);
  const [nuevoItem, setNuevoItem] = useState("");
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [nombreEditado, setNombreEditado] = useState("");

  useEffect(() => {
    const cargarItems = () => {
      const itemsExistentes = subcategoriasEgresos
        .filter((sub) => sub.categoriaPadre === subcategoria.codigo)
        .map((sub) => ({
          nombre: sub.nombre,
          codigo: sub.codigo,
        }));
      setItems(itemsExistentes);
    };

    cargarItems();
  }, [subcategoria, subcategoriasEgresos]);

  const handleAgregarItem = () => {
    if (!nuevoItem.trim()) return;

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
        await actualizarItem(itemEditado.codigo, nombreEditado.trim());
        window.location.reload();
      } else {
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
    <div className="egresos-modal-overlay">
      <div className="egresos-modal-container">
        <div className="egresos-modal-header">
          <h3>Items de {subcategoria.nombre}</h3>
          <button className="egresos-btn-close" onClick={onCerrar}>
            <FaTimes />
          </button>
        </div>

        <div className="egresos-items-existentes">
          <p className="egresos-agregar-nuevo-item">Items Actuales:</p>
          <div className="egresos-items-list">
            {items.map((item, index) => (
              <div
                key={item.codigo || index}
                className="egresos-item egresos-existing"
              >
                {editandoIndex === index ? (
                  <div className="egresos-edit-container">
                    <input
                      type="text"
                      value={nombreEditado}
                      onChange={(e) => setNombreEditado(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") handleGuardarEdicion(index);
                      }}
                    />
                    <button
                      className="egresos-btn-save-icon"
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

        <div className="egresos-separador"></div>

        <p className="egresos-agregar-nuevo-item">Agregar Nuevo Item:</p>
        <div className="egresos-input-container">
          <input
            type="text"
            value={nuevoItem}
            onChange={(e) => setNuevoItem(e.target.value)}
            placeholder="Nombre del nuevo item"
          />
          <button
            className="egresos-btn-icon"
            onClick={handleAgregarItem}
            title="Agregar"
          >
            <FaPlus />
          </button>
        </div>

        <div className="egresos-buttons-container">
          <button
            className="egresos-btn-icon egresos-cancel"
            onClick={onCerrar}
          >
            <FaTimes />
          </button>
          <button
            className="egresos-btn-save-icon egresos-main-save"
            onClick={() => onGuardar(items.filter((item) => !item.codigo))}
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
    codigo: PropTypes.string.isRequired,
    nombre: PropTypes.string.isRequired,
    nivel: PropTypes.number.isRequired,
    categoriaPadre: PropTypes.string,
  }).isRequired,
  subcategoriasEgresos: PropTypes.array.isRequired,
  onGuardar: PropTypes.func.isRequired,
  onCerrar: PropTypes.func.isRequired,
};
