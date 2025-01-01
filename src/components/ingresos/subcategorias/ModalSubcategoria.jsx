import React, { useState } from "react";
import PropTypes from "prop-types";
import { FaSave } from "react-icons/fa";
import "./ModalSubcategoria.scss";

export const ModalSubcategoria = ({
  isOpen,
  onClose,
  codigoAsignar,
  onSubmit,
  isPrincipal = false,
}) => {
  const [tipoAccion, setTipoAccion] = useState("subcategoria"); // 'subcategoria' o 'lista'
  const [nombre, setNombre] = React.useState("");
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tipoAccion === "subcategoria" && nombre.trim()) {
      onSubmit({
        tipo: "subcategoria",
        datos: {
          codigo: codigoAsignar,
          nombre: nombre.trim(),
          nivel: isPrincipal ? 1 : codigoAsignar.split(".").length,
          categoriaPadre: isPrincipal
            ? ""
            : codigoAsignar.split(".").slice(0, -1).join("."),
        },
      });
    } else if (tipoAccion === "lista") {
      onSubmit({
        tipo: "lista",
        datos: {
          codigo: codigoAsignar,
        },
      });
    }
    setNombre("");
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>
          {isPrincipal ? "Nueva Categoría Principal" : "Nueva Subcategoría"}
        </h2>

        <div className="codigo-preview">
          <label>Código a asignar:</label>
          <span className="codigo-valor">{codigoAsignar}</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <select
              value={tipoAccion}
              onChange={(e) => setTipoAccion(e.target.value)}
              className="form-select"
            >
              <option value="subcategoria">Agregar Subcategoría</option>
              <option value="lista">Asignar Lista</option>
            </select>
          </div>

          {tipoAccion === "subcategoria" && (
            <div className="form-group">
              <input
                ref={inputRef}
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre"
                className="form-input"
              />
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-cancelar" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-grabar">
              <FaSave className="icono-grabar" />
              <span>Grabar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ModalSubcategoria.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  codigoAsignar: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isPrincipal: PropTypes.bool,
};
