import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Box, Alert } from "@mui/material";
import { FormFields } from "./FormFields";
import { INITIAL_SUBCATEGORIA_FORM_STATE } from "../../../config/constants";
import { FaSave, FaList } from "react-icons/fa";
import { GestionLista } from "./GestionLista";
import "./FormularioSubcategoriaIngresos.scss";
import {
  createSubcategoriaIngreso,
  guardarListaSubcategoria,
} from "../../../services/subcategoriaIngresosService";

export const FormularioSubcategoriaIngresos = ({
  onSubcategoriaCreada,
  subcategorias,
  rutaActual = [],
  onRutaChange,
}) => {
  const [formData, setFormData] = useState(INITIAL_SUBCATEGORIA_FORM_STATE);
  const [error, setError] = useState("");
  const [mostrarModalLista, setMostrarModalLista] = useState(false);
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] =
    useState(null);

  const handleChange = useCallback((e) => {
    const value =
      e.target.name === "nivel" ? Number(e.target.value) : e.target.value;
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  }, []);

  const handleAbrirModalLista = useCallback(() => {
    // Si no hay código en formData, no podemos abrir el modal
    if (!formData.codigo) {
      setError("Debe ingresar un código de subcategoría primero");
      return;
    }

    // Buscar la subcategoría completa
    const subcategoriaActual = subcategorias.find(
      (sub) => sub.codigo === formData.codigo
    ) || {
      // Si no existe, crear una nueva con los datos mínimos requeridos
      _id: formData.codigo,
      codigo: formData.codigo,
      nombre: formData.nombre,
      nivel: formData.nivel || 1,
      esLista: true,
    };

    setSubcategoriaSeleccionada({
      ...subcategoriaActual,
      origenModal: "botonLista",
    });
    setMostrarModalLista(true);
  }, [formData, subcategorias]);

  useEffect(() => {
    if (rutaActual?.length > 0) {
      const subcategoriaActual = rutaActual[rutaActual.length - 1];
      if (subcategoriaActual?.esLista) {
        handleAbrirModalLista();
      }
    }
  }, [rutaActual, handleAbrirModalLista]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Validar datos requeridos
      if (!formData.codigo || !formData.nombre) {
        throw new Error("El código y nombre son requeridos");
      }

      // Verificar si el padre es una lista
      const subcategoriaPadre = rutaActual[rutaActual.length - 1];
      if (subcategoriaPadre?.esLista) {
        throw new Error(
          "No se pueden crear subcategorías dentro de una lista. Para agregar items use el botón 'Agregar lista a subcategoria'"
        );
      }

      const dataToSend = {
        ...formData,
        nivel: Number(formData.nivel),
        categoriaPadre: formData.categoriaPadre || "",
        categoriaBase: formData.categoriaBase || "",
        esLista: Boolean(formData.esLista),
      };

      console.log("Datos a enviar:", dataToSend);

      await createSubcategoriaIngreso(dataToSend);
      setFormData(INITIAL_SUBCATEGORIA_FORM_STATE);
      onSubcategoriaCreada();
    } catch (err) {
      console.error("Error al crear subcategoría:", err);
      setError(err.message);
    }
  };

  const handleCerrarModalLista = () => {
    setMostrarModalLista(false);
  };

  const handleGuardarLista = async (lista) => {
    try {
      setError("");
      // Buscar la subcategoría por código
      const subcategoria = subcategorias.find(
        (sub) => sub.codigo === lista.codigoBase
      );
      if (!subcategoria) {
        throw new Error("Subcategoría no encontrada");
      }
      await guardarListaSubcategoria(subcategoria._id, lista);
      handleCerrarModalLista();
      if (onSubcategoriaCreada) {
        onSubcategoriaCreada();
      }
    } catch (error) {
      setError("Error al guardar la lista: " + error.message);
    }
  };

  const handleAbrirListaSubcategoria = (subcategoria) => {
    setSubcategoriaSeleccionada({
      ...subcategoria,
      origenModal: "botonLista",
    });
    setMostrarModalLista(true);
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
        <div className="boton-con-texto">
          <button
            className="btn-lista"
            onClick={handleAbrirModalLista}
            type="button"
          >
            <FaList />
          </button>
          <span className={`texto-lista`}>Agregar lista a subcategoria</span>
        </div>
      </div>

      <div className="input-container">
        <FormFields
          formData={formData}
          handleChange={handleChange}
          subcategoriasIngresos={subcategorias}
          onRutaChange={onRutaChange}
          onAbrirModalLista={handleAbrirListaSubcategoria}
        />
      </div>

      {mostrarModalLista && subcategoriaSeleccionada && (
        <GestionLista
          subcategoria={subcategoriaSeleccionada}
          onCerrar={() => setMostrarModalLista(false)}
          onGuardar={handleGuardarLista}
        />
      )}
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
  rutaActual: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      codigo: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
      nivel: PropTypes.number.isRequired,
      categoriaPadre: PropTypes.string,
      esLista: PropTypes.bool.isRequired,
    })
  ),
  onRutaChange: PropTypes.func.isRequired,
};
