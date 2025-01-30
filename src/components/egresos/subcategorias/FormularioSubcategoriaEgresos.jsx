import { forwardRef, useImperativeHandle, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Box, Alert } from "@mui/material";
import { FormFields } from "./FormFields";
import { INITIAL_SUBCATEGORIA_FORM_STATE } from "../../../config/constants";
import { FaSave } from "react-icons/fa";
import "./FormularioSubcategoriaEgresos.scss";
import { createSubcategoriaEgreso } from "../../../services/subcategoriaEgresosService";

const FormularioSubcategoriaEgresosComponent = forwardRef(
  (
    {
      onSubcategoriaCreada,
      subcategorias,
      rutaActual,
      onRutaChange,
      autoFocus,
    },
    ref
  ) => {
    const [formData, setFormData] = useState(INITIAL_SUBCATEGORIA_FORM_STATE);
    const [error, setError] = useState("");

    const clearError = useCallback(() => setError(""), []);

    const handleChange = useCallback((e) => {
      const value =
        e.target.name === "nivel" ? Number(e.target.value) : e.target.value;
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: value,
      }));
    }, []);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!formData.codigo || !formData.nombre) {
        setError("El código y nombre son requeridos");
        return;
      }

      try {
        const dataToSend = {
          ...formData,
          nivel: Number(formData.nivel),
          categoriaPadre: formData.categoriaPadre || "",
        };

        const nuevaSubcategoria = await createSubcategoriaEgreso(dataToSend);
        if (nuevaSubcategoria) {
          setFormData(INITIAL_SUBCATEGORIA_FORM_STATE);
          onSubcategoriaCreada();
          onRutaChange(rutaActual);
        }
      } catch (error) {
        console.error("Error al crear subcategoría:", error);
        setError(error.message);
      }
    };

    useImperativeHandle(ref, () => ({
      actualizarFormulario: (datos) => {
        setFormData((prevData) => ({
          ...prevData,
          categoriaPadre: datos.categoriaPadre,
          nivel: datos.nivel,
          codigo: "",
          nombre: "",
        }));
      },
    }));

    return (
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="egresos-formulario-subcategoria"
        noValidate
      >
        {error && (
          <Alert severity="error" className="egresos-alerta-error">
            {error}
          </Alert>
        )}

        <div className="egresos-icono-centrado">
          <div className="egresos-boton-con-texto">
            <FaSave
              className="egresos-icono-agregar"
              onClick={handleSubmit}
              title="Guardar subcategoría"
            />
            <span className="egresos-texto-grabar">Grabar subcategoría</span>
          </div>
        </div>

        <div className="egresos-input-container">
          <FormFields
            formData={formData}
            handleChange={handleChange}
            subcategoriasEgresos={subcategorias}
            clearError={clearError}
            autoFocus={autoFocus}
          />
        </div>
      </Box>
    );
  }
);

FormularioSubcategoriaEgresosComponent.displayName =
  "FormularioSubcategoriaEgresos";

FormularioSubcategoriaEgresosComponent.propTypes = {
  onSubcategoriaCreada: PropTypes.func.isRequired,
  subcategorias: PropTypes.array.isRequired,
  rutaActual: PropTypes.array.isRequired,
  onRutaChange: PropTypes.func.isRequired,
  autoFocus: PropTypes.bool,
};

export const FormularioSubcategoriaEgresos =
  FormularioSubcategoriaEgresosComponent;
