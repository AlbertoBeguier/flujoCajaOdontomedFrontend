import { useState } from "react";
import logo from "../../../assets/odontomed512_512.png";
import logo1 from "../../../assets/odontomedBigLogo.png";
import { createEgreso } from "../../../services/egresosService";
import { FormularioEgreso } from "./FormularioEgreso";
import { useCategoriasEgresos } from "../../../hooks/useCategoriasEgresos";
import { ListadoEgresos } from "./ListadoEgresos";
import "./RegistroEgresos.scss";

export const RegistroEgresos = () => {
  const {
    rutaSeleccion,
    categoriasVisibles,
    cargando,
    error,
    esCategoriaNivelFinal,
    seleccionarCategoria,
    volverAtras,
  } = useCategoriasEgresos();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [ultimoEgresoId, setUltimoEgresoId] = useState(null);

  const handleSeleccionar = () => {
    if (rutaSeleccion.length > 0) {
      setMostrarFormulario(true);
    }
  };

  const handleGuardarEgreso = async (egresoData) => {
    try {
      const nuevoEgreso = await createEgreso(egresoData);
      setUltimoEgresoId(nuevoEgreso._id);
      return nuevoEgreso;
    } catch (error) {
      console.error("Error al guardar el egreso:", error);
      throw error;
    }
  };

  const handleCancelarEgreso = () => {
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
      <>
        <FormularioEgreso
          categoriaSeleccionada={rutaSeleccion[rutaSeleccion.length - 1]}
          rutaCompleta={rutaSeleccion}
          onGuardar={handleGuardarEgreso}
          onCancelar={handleCancelarEgreso}
        />
      </>
    );
  }

  const categoriaActual = rutaSeleccion[rutaSeleccion.length - 1];
  const mostrarBotonRegistrar =
    categoriaActual && esCategoriaNivelFinal(categoriaActual);

  return (
    <>
      <div className="pagina-egresos-container-2">
        <img src={logo} alt="Logo" className="egresos-logo" />
        <img src={logo1} alt="Logo1" className="egresos-logo-1" />
        <p className="egresos-registro-titulo">Registro de Gastos</p>
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
      <ListadoEgresos ultimoEgresoId={ultimoEgresoId} />
    </>
  );
};
