import { useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import "./FormFields.scss";

export const FormFields = ({
  formData,
  handleChange,
  subcategoriasIngresos,
  clearError,
  autoFocus,
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    clearError();
  }, [formData, clearError]);

  const generarNuevoCodigo = useCallback(
    (codigoPadre) => {
      // Verificación de seguridad
      if (!Array.isArray(subcategoriasIngresos)) {
        console.error(
          "subcategoriasIngresos no es un array:",
          subcategoriasIngresos
        );
        return "1";
      }

      if (!codigoPadre) {
        const codigosNivel1 = subcategoriasIngresos
          .filter((sub) => !sub.categoriaPadre)
          .map((sub) => parseInt(sub.codigo))
          .filter((codigo) => !isNaN(codigo));

        if (codigosNivel1.length === 0) {
          return "1";
        }

        const maxCodigo = Math.max(...codigosNivel1);
        return (maxCodigo + 1).toString();
      }

      const codigosHijos = subcategoriasIngresos
        .filter((sub) => sub.categoriaPadre === codigoPadre)
        .map((sub) => parseInt(sub.codigo.split(".").pop()))
        .filter((codigo) => !isNaN(codigo));

      if (codigosHijos.length === 0) {
        return `${codigoPadre}.1`;
      }

      const maxCodigoHijo = Math.max(...codigosHijos);
      return `${codigoPadre}.${maxCodigoHijo + 1}`;
    },
    [subcategoriasIngresos]
  );

  // Efecto para generar código inicial
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

  // Efecto para el autofocus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <div className="form-fields-container">
      <div className="form-group">
        <div className="codigo-preview">
          <label>Código a asignar:</label>
          <span className="codigo-valor">{formData.codigo}</span>
        </div>
      </div>
      <div className="form-group">
        <input
          ref={inputRef}
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          className="form-input"
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
  subcategoriasIngresos: PropTypes.array.isRequired,
  clearError: PropTypes.func.isRequired,
  autoFocus: PropTypes.bool,
};
