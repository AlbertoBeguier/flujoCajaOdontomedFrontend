import PropTypes from "prop-types";
import { useState } from "react";
import "./ModalListaMaestra.scss";

export const ModalListaMaestra = ({
  isOpen,
  onClose,
  onSubmit,
  lista = null,
}) => {
  const [formData, setFormData] = useState({
    nombre: lista?.nombre || "",
    descripcion: lista?.descripcion || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{lista ? "Editar Lista Maestra" : "Nueva Lista Maestra"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre de la Lista</label>
            <input
              id="nombre"
              type="text"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
              rows={3}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancelar" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-guardar">
              {lista ? "Guardar Cambios" : "Crear Lista"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ModalListaMaestra.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  lista: PropTypes.shape({
    nombre: PropTypes.string,
    descripcion: PropTypes.string,
  }),
};
