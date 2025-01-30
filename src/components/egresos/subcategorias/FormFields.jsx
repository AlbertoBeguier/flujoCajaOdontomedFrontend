import PropTypes from "prop-types";
import { useEffect, useCallback, useRef } from "react";
import "./FormFields.scss";

export const FormFields = ({
  formData,
  handleChange,
  subcategoriasEgresos,
  clearError,
  autoFocus,
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    clearError();
  }, [formData, clearError]);

  const generarNuevoCodigo = useCallback(
    (codigoPadre) => {
      if (!Array.isArray(subcategoriasEgresos)) {
        console.error(
          "subcategoriasEgresos no es un array:",
          subcategoriasEgresos
        );
        return "1";
      }

      if (!codigoPadre) {
        const codigosNivel1 = subcategoriasEgresos
          .filter((sub) => !sub.categoriaPadre)
          .map((sub) => parseInt(sub.codigo))
          .filter((codigo) => !isNaN(codigo));

        return codigosNivel1.length > 0
          ? (Math.max(...codigosNivel1) + 1).toString()
          : "1";
      }

      const codigosHijos = subcategoriasEgresos
        .filter((sub) => sub.categoriaPadre === codigoPadre)
        .map((sub) => parseInt(sub.codigo.split(".").pop()))
        .filter((codigo) => !isNaN(codigo));

      return codigosHijos.length > 0
        ? `${codigoPadre}.${Math.max(...codigosHijos) + 1}`
        : `${codigoPadre}.1`;
    },
    [subcategoriasEgresos]
  );

  useEffect(() => {
    if (formData.categoriaPadre && !formData.codigo) {
      const nuevoCodigo = generarNuevoCodigo(formData.categoriaPadre);
      handleChange({
        target: {
          name: "codigo",
          value: nuevoCodigo,
        },
      });
    }
  }, [
    formData.categoriaPadre,
    formData.codigo,
    generarNuevoCodigo,
    handleChange,
  ]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <div className="egresos-form-fields-container">
      <div className="egresos-form-group">
        <div className="egresos-codigo-preview">
          <label>Código a asignar:</label>
          <span className="egresos-codigo-valor">{formData.codigo}</span>
        </div>
      </div>
      <div className="egresos-form-group">
        <input
          ref={inputRef}
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          className="egresos-form-input"
        />
      </div>
    </div>
  );
};

FormFields.propTypes = {
  formData: PropTypes.shape({
    codigo: PropTypes.string.isRequired,
    nombre: PropTypes.string.isRequired,
    nivel: PropTypes.number.isRequired,
    categoriaPadre: PropTypes.string,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  subcategoriasEgresos: PropTypes.array.isRequired,
  clearError: PropTypes.func.isRequired,
  autoFocus: PropTypes.bool,
};
