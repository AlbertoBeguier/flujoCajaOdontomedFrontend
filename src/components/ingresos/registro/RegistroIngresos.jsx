import { useState } from "react";
import logo from "../../../assets/odontomed512_512.png";
import logo1 from "../../../assets/odontomedBigLogo.png";
import { createIngreso } from "../../../services/ingresosService";
import { FormularioIngreso } from "./FormularioIngreso";
import { useCategorias } from "../../../hooks/useCategorias";
import "./RegistroIngresos.scss";

export const RegistroIngresos = () => {
  const {
    rutaSeleccion,
    categoriasVisibles,
    cargando,
    error,
    esCategoriaNivelFinal,
    seleccionarCategoria,
    volverAtras,
    resetearSeleccion,
  } = useCategorias();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const handleSeleccionar = () => {
    if (rutaSeleccion.length > 0) {
      setMostrarFormulario(true);
    }
  };

  const handleGuardarIngreso = async (ingresoData) => {
    try {
      await createIngreso(ingresoData);
      setMostrarFormulario(false);
      resetearSeleccion();
    } catch (error) {
      console.error("Error al guardar el ingreso:", error);
    }
  };

  const handleCancelarIngreso = () => {
    setMostrarFormulario(false);
  };

  if (cargando) {
    return <div className="mensaje-carga">Cargando categorías...</div>;
  }

  if (error) {
    return <div className="mensaje-error">Error: {error}</div>;
  }

  if (mostrarFormulario) {
    return (
      <FormularioIngreso
        categoriaSeleccionada={rutaSeleccion[rutaSeleccion.length - 1]}
        rutaCompleta={rutaSeleccion}
        onGuardar={handleGuardarIngreso}
        onCancelar={handleCancelarIngreso}
      />
    );
  }

  const categoriaActual = rutaSeleccion[rutaSeleccion.length - 1];
  const mostrarBotonRegistrar =
    categoriaActual && esCategoriaNivelFinal(categoriaActual);

  return (
    <>
      <div className="pagina-ingresos-container-2">
        <img src={logo} alt="Logo" className="ingresos-logo" />
        <img src={logo1} alt="Logo1" className="ingresos-logo-1" />
        <p className="ingresos-registro-titulo">Registro de Ingresos</p>
      </div>
      <div className="seleccion-categorias-container">
        {rutaSeleccion.length > 0 && (
          <div className="ruta-navegacion">
            <button className="boton-volver" onClick={volverAtras}>
              ← Volver
            </button>
            <div className="ruta-seleccion">
              {rutaSeleccion.map((cat, index) => (
                <span key={cat.codigo} className="categoria-seleccionada">
                  {index > 0 ? " → " : ""}
                  {cat.nombre}
                </span>
              ))}
            </div>
            {mostrarBotonRegistrar && (
              <button className="boton-registrar" onClick={handleSeleccionar}>
                Registrar →
              </button>
            )}
          </div>
        )}
        <div className="grid-categorias">
          {categoriasVisibles.map((categoria) => (
            <button
              key={categoria.codigo}
              className="boton-categoria"
              onClick={() => seleccionarCategoria(categoria)}
            >
              {categoria.nombre}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
