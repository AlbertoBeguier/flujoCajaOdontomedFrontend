import { Link } from "react-router-dom";
import { ListadoEgresos } from "./registro/ListadoEgresos";
import logo from "../../assets/odontomed512_512.png";
import logo1 from "../../assets/odontomedBigLogo.png";
import { FaCashRegister, FaSitemap, FaChartLine } from "react-icons/fa";
import "./Egresos.scss";

export const Egresos = () => {
  return (
    <>
      <div className="pagina-egresos-container">
        <img src={logo} alt="Logo" className="egresos-logo" />
        <img src={logo1} alt="Logo1" className="egresos-logo-1" />
        <p className="egresos-titulo">Gestión de Egresos</p>
      </div>

      <div className="pagina-egresos-container">
        <Link to="/registrar-egresos">
          <button className="btn-reg-egresos">
            <FaCashRegister className="btn-egresos-icon" />
            Registrar Egresos
          </button>
        </Link>
        <Link to="/agregar-subcategorias-egresos">
          <button className="btn-subcategorias-egresos">
            <FaSitemap className="btn-egresos-icon" />
            Agregar Subcategorías
          </button>
        </Link>
        <Link to="/dashboard-egresos">
          <button className="btn-dashboard-egresos">
            <FaChartLine className="btn-egresos-icon" />
            Dashboard Egresos
          </button>
        </Link>
      </div>

      <ListadoEgresos />
    </>
  );
};
