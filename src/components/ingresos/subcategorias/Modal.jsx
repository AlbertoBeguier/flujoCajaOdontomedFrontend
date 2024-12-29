import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./Modal.scss";

export const Modal = ({ children, onClose, onConfirm }) => {
  const [isConfirmEnabled, setIsConfirmEnabled] = useState(false);

  useEffect(() => {
    // Agregar clase al body cuando el modal se abre
    document.body.classList.add("modal-open");

    return () => {
      // Remover clase cuando el modal se cierra
      document.body.classList.remove("modal-open");
    };
  }, []);

  const handleConfirmClick = () => {
    if (!isConfirmEnabled) {
      setIsConfirmEnabled(true);
      return;
    }
    onConfirm();
  };

  return (
    <div className="modal-overlay">
      <div>
        {children}
        <div className="modal-buttons">
          <button className="btn-cancelar" onClick={onClose}>
            Cancelar
          </button>
          <button
            className={`btn-confirmar ${
              isConfirmEnabled ? "enabled" : "disabled"
            }`}
            onClick={handleConfirmClick}
          >
            {isConfirmEnabled ? "Click para confirmar" : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};
