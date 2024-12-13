import logo from "../../assets/odontomed512_512.png";
import logo1 from "../../assets/odontomedBigLogo.png";
import "./Ingresos.css";
import { FaPlusCircle, FaCashRegister } from "react-icons/fa"; // Iconos para los botones
import { Link } from "react-router-dom";
export const Ingresos = () => {
  return (
    <>
      <div className="pagina-ingresos-container">
        <img src={logo} alt="Logo" className="ingresos-logo" />
        <img src={logo1} alt="Logo1" className="ingresos-logo-1" />
        <p className="ingresos-titulo">Ingresos</p>
      </div>
      <div className="pagina-ingresos-container">
        <button className="btn-reg-ingresos">
          <FaCashRegister className="btn-ingresos-icon" />
          Registrar Ingresos
        </button>
        <Link to="/agregar-ingresos">
          <button className="btn-agregar-ingresos">
            <FaPlusCircle className="btn-ingresos-icon" />
            Agregar Categorías
          </button>
        </Link>
      </div>
    </>
  );
};
