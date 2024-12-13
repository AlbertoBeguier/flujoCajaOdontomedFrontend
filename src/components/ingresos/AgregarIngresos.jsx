import logo from "../../assets/odontomed512_512.png";
import logo1 from "../../assets/odontomedBigLogo.png";
import "./Ingresos.css";

export const AgregarIngresos = () => {
  return (
    <>
      <div className="pagina-ingresos-container">
        <img src={logo} alt="Logo" className="ingresos-logo" />
        <img src={logo1} alt="Logo1" className="ingresos-logo-1" />
        <p className="ingresos-titulo">Agregar Ingresos</p>
      </div>
      <div className="pagina-ingresos-container"></div>
    </>
  );
};
