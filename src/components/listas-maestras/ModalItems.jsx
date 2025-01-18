import { useState } from "react";
import PropTypes from "prop-types";
import { addItemToLista } from "../../services/listaMaestraService";
import { AiOutlineClose } from "react-icons/ai";
import "./ModalItems.scss";

export const ModalItems = ({
  isOpen,
  onClose,
  lista: listaInicial,
  onItemsUpdated,
}) => {
  const [nuevoItem, setNuevoItem] = useState("");
  const [itemSeleccionado, setItemSeleccionado] = useState(null);
  const [rutaActual, setRutaActual] = useState([]);
  const [listaActual, setListaActual] = useState(listaInicial);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nuevoItem.trim()) return;

    try {
      const itemData = {
        nombre: nuevoItem,
        parentId: itemSeleccionado?._id,
      };

      const listaActualizada = await addItemToLista(listaActual._id, itemData);
      setListaActual(listaActualizada);
      setNuevoItem("");
      onItemsUpdated();
    } catch (error) {
      console.error("Error al agregar item:", error);
    }
  };

  const renderItems = (items = listaActual.items, nivel = 0) => {
    return items?.map((item, index) => (
      <div key={index} className={`item-container nivel-${nivel}`}>
        <div className="item-content">
          <span className="item-nombre">{item.nombre}</span>
          <button
            type="button"
            className="btn-agregar-subitem"
            onClick={() => {
              setItemSeleccionado(item);
              setRutaActual([...rutaActual, item.nombre]);
            }}
          >
            Agregar Subitem
          </button>
        </div>
        {item.items && item.items.length > 0 && (
          <div className="subitems">{renderItems(item.items, nivel + 1)}</div>
        )}
      </div>
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="btn-cerrar-modal" onClick={onClose} title="Cerrar">
          <AiOutlineClose />
        </button>
        <h2>
          Agregar Items a<span>{listaActual.nombre}</span>
        </h2>
        {rutaActual.length > 0 && (
          <div className="ruta-actual">
            {rutaActual.join(" > ")}
            <button
              className="btn-volver"
              onClick={() => {
                setItemSeleccionado(null);
                setRutaActual([]);
              }}
            >
              Volver al inicio
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombreItem">
              {itemSeleccionado
                ? `Nuevo subitem en "${itemSeleccionado.nombre}"`
                : "Nuevo item"}
            </label>
            <div className="input-buttons-container">
              <input
                id="nombreItem"
                type="text"
                value={nuevoItem}
                onChange={(e) => setNuevoItem(e.target.value)}
                required
                autoFocus
              />
              <button type="button" className="btn-cancelar" onClick={onClose}>
                Cerrar
              </button>
              <button type="submit" className="btn-guardar">
                {itemSeleccionado ? "Agregar Subitem" : "Agregar Item"}
              </button>
            </div>
          </div>
          <div className="items-list-modal">
            {renderItems(listaActual.items)}
          </div>
        </form>
      </div>
    </div>
  );
};

ModalItems.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  lista: PropTypes.object.isRequired,
  onItemsUpdated: PropTypes.func.isRequired,
};
