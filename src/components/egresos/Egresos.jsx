import { Link } from "react-router-dom";
import { ListadoEgresos } from "./registro/ListadoEgresos";
import { ListaCategorias } from "./categorias/ListaCategorias";
import logo from "../../assets/odontomed512_512.png";
import logo1 from "../../assets/odontomedBigLogo.png";
import { FaRegPlusSquare, FaRegListAlt, FaSitemap } from "react-icons/fa";
import "./Egresos.scss";

export const Egresos = () => {
  return (
    <>
      <div className="pagina-egresos-container">
        <img src={logo} alt="Logo" className="egresos-logo" />
        <img src={logo1} alt="Logo1" className="egresos-logo-1" />
        <p className="egresos-titulo">Gestión de Gastos</p>
      </div>

      <div className="egresos-container">
        <Link to="/registrar-egresos">
          <button className="btn-reg-egresos">
            <FaRegListAlt className="btn-egresos-icon" />
            Registrar Gastos
          </button>
        </Link>
        <Link to="/agregar-egresos">
          <button className="btn-agregar-egresos">
            <FaRegPlusSquare className="btn-egresos-icon" />
            Agregar Categorías
          </button>
        </Link>
        <Link to="/agregar-subcategorias-egresos">
          <button className="btn-subcategorias-egresos">
            <FaSitemap className="btn-egresos-icon" />
            Agregar Subcategorías
          </button>
        </Link>
      </div>

      <ListadoEgresos />
      <ListaCategorias />
    </>
  );
};
