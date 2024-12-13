import { useState } from "react";
import logo from "../../assets/odontomed512_512.png";
import logo1 from "../../assets/odontomedBigLogo.png";
import { GestionCategorias } from "./categorias/GestionCategorias";
import "./AgregarIngresos.css";

export const AgregarIngresos = () => {
  const [seccionActiva, setSeccionActiva] = useState("ingresos");

  return (
    <div className="contenedor-principal">
      <div className="pagina-ingresos-container">
        <img src={logo} alt="Logo" className="ingresos-logo" />
        <img src={logo1} alt="Logo1" className="ingresos-logo-1" />
        <p className="ingresos-titulo">Agregar Ingresos</p>
      </div>

      <div className="botones-container">
        <button
          className={`boton-seccion ${
            seccionActiva === "ingresos" ? "activo" : ""
          }`}
          onClick={() => setSeccionActiva("ingresos")}
        >
          Registrar Ingreso
        </button>
        <button
          className={`boton-seccion ${
            seccionActiva === "categorias" ? "activo" : ""
          }`}
          onClick={() => setSeccionActiva("categorias")}
        >
          Gestionar Categorías
        </button>
      </div>

      <div className="contenido-seccion">
        {seccionActiva === "ingresos" ? (
          <div className="panel-content">
            Formulario de registro de ingresos (próximamente)
          </div>
        ) : (
          <GestionCategorias />
        )}
      </div>
    </div>
  );
};
