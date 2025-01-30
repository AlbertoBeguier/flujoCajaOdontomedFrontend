import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaSave } from "react-icons/fa";
import { getListasMaestras } from "../../../services/listaMaestraService";
import "./ModalSubcategoria.scss";

export const ModalSubcategoria = ({
  isOpen,
  onClose,
  codigoAsignar,
  onSubmit,
  isPrincipal = false,
  nombreSubcategoria,
}) => {
  console.log("Modal recibió nombreSubcategoria:", nombreSubcategoria);
  const [tipoAccion, setTipoAccion] = useState("subcategoria");
  const [nombre, setNombre] = useState("");
  const [listas, setListas] = useState([]);
  const [listaSeleccionada, setListaSeleccionada] = useState("");
  const inputRef = React.useRef(null);

  useEffect(() => {
    if (isOpen && tipoAccion === "lista") {
      const cargarListas = async () => {
        try {
          const listasData = await getListasMaestras();
          setListas(listasData);
        } catch (error) {
          console.error("Error al cargar listas:", error);
        }
      };
      cargarListas();
    }
  }, [isOpen, tipoAccion]);

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
    } else if (tipoAccion === "lista" && listaSeleccionada) {
      onSubmit({
        tipo: "lista",
        datos: {
          codigo: codigoAsignar.split(".").slice(0, -1).join("."),
          listaId: listaSeleccionada,
        },
      });
    }
    setNombre("");
    setListaSeleccionada("");
  };

  if (!isOpen) return null;

  return (
    <div className="egresos-modal-overlay">
      <div className="egresos-modal-content">
        <h2>
          {isPrincipal ? "Nueva Categoría Principal" : "Nueva Subcategoría"}
        </h2>

        <div className="egresos-codigo-preview">
          <div className="egresos-codigo-info-row">
            <div className="egresos-codigo-section">
              <label>Código a asignar:</label>
              <span className="egresos-codigo-valor">{codigoAsignar}</span>
            </div>
            {!isPrincipal && nombreSubcategoria && (
              <div className="egresos-subcategoria-section">
                <label>
                  {tipoAccion === "lista"
                    ? "Asignar lista a:"
                    : "Agregar subcategoría a:"}
                </label>
                <span className="egresos-nombre-subcategoria">
                  {nombreSubcategoria}
                </span>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="egresos-form-group">
            <select
              value={tipoAccion}
              onChange={(e) => setTipoAccion(e.target.value)}
              className="egresos-form-select"
            >
              <option value="subcategoria">Agregar Subcategoría</option>
              <option value="lista">Asignar Lista</option>
            </select>
          </div>

          {tipoAccion === "subcategoria" ? (
            <div className="egresos-form-group">
              <input
                ref={inputRef}
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre"
                className="egresos-form-input"
              />
            </div>
          ) : (
            <div className="egresos-form-group">
              <select
                value={listaSeleccionada}
                onChange={(e) => setListaSeleccionada(e.target.value)}
                className="egresos-form-select"
              >
                <option value="">Seleccione una lista...</option>
                {listas.map((lista) => (
                  <option key={lista._id} value={lista._id}>
                    {lista.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="egresos-modal-actions">
            <button
              type="button"
              className="egresos-btn-cancelar"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="egresos-btn-grabar"
              disabled={
                (tipoAccion === "subcategoria" && !nombre.trim()) ||
                (tipoAccion === "lista" && !listaSeleccionada)
              }
            >
              <FaSave className="egresos-icono-grabar" />
              <span className="egresos-texto-grabar">Grabar</span>
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
  nombreSubcategoria: PropTypes.string,
};
