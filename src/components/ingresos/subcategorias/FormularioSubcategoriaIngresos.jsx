import { useState } from "react";
import PropTypes from "prop-types";
import { Box, Alert } from "@mui/material";
import { FormFields } from "./FormFields";
import { INITIAL_SUBCATEGORIA_FORM_STATE } from "../../../config/constants";
import { FaSave } from "react-icons/fa";
import "./FormularioSubcategoriaIngresos.scss";
import { createSubcategoriaIngreso } from "../../../services/subcategoriaIngresosService";

export const FormularioSubcategoriaIngresos = ({
  onSubcategoriaCreada,
  subcategorias,
  onRutaChange,
}) => {
  const [formData, setFormData] = useState(INITIAL_SUBCATEGORIA_FORM_STATE);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const value =
      e.target.name === "nivel" ? Number(e.target.value) : e.target.value;
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (!formData.codigo || !formData.nombre) {
        throw new Error("El código y nombre son requeridos");
      }

      const dataToSend = {
        ...formData,
        nivel: Number(formData.nivel),
        categoriaPadre: formData.categoriaPadre || "",
        categoriaBase: formData.categoriaBase || "",
      };

      await createSubcategoriaIngreso(dataToSend);
      setFormData(INITIAL_SUBCATEGORIA_FORM_STATE);
      onSubcategoriaCreada();
    } catch (err) {
      console.error("Error al crear subcategoría:", err);
      setError(err.message);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      className="formulario-subcategoria"
    >
      {error && (
        <Alert severity="error" className="alerta-error">
          {error}
        </Alert>
      )}

      <div className="icono-centrado">
        <div className="boton-con-texto">
          <FaSave
            className="icono-agregar"
            onClick={handleSubmit}
            title="Guardar subcategoría"
          />
          <span className="texto-grabar">Grabar subcategoría</span>
        </div>
      </div>

      <div className="input-container">
        <FormFields
          formData={formData}
          handleChange={handleChange}
          subcategoriasIngresos={subcategorias}
          onRutaChange={onRutaChange}
        />
      </div>
    </Box>
  );
};

FormularioSubcategoriaIngresos.propTypes = {
  onSubcategoriaCreada: PropTypes.func.isRequired,
  subcategorias: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      codigo: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
      nivel: PropTypes.number.isRequired,
      categoriaPadre: PropTypes.string,
    })
  ),
  onRutaChange: PropTypes.func.isRequired,
};
