import { useState, useEffect } from "react";
import logo from "../../assets/odontomed512_512.png";
import logo1 from "../../assets/odontomedBigLogo.png";
import "./Ingresos.scss";
import { FaPlusCircle, FaCashRegister } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ListaCategorias } from "./categorias/ListaCategorias";
import { API_BASE_URL } from "../../config/constants";
import { ListadoIngresos } from "./registro/ListadoIngresos";

export const Ingresos = () => {
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/categorias-ingresos`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            `Error al cargar las categorías: ${
              errorData.mensaje || response.statusText
            }`
          );
        }
        const data = await response.json();
        setCategorias(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCategorias();
  }, []);

  return (
    <>
      <div className="pagina-ingresos-container">
        <img src={logo} alt="Logo" className="ingresos-logo" />
        <img src={logo1} alt="Logo1" className="ingresos-logo-1" />
        <p className="ingresos-titulo">Registro de Ingresos</p>
      </div>

      <div className="pagina-ingresos-container">
        <Link to="/registar-ingresos">
          <button className="btn-reg-ingresos">
            <FaCashRegister className="btn-ingresos-icon" />
            Registrar Ingresos
          </button>
        </Link>
        <Link to="/agregar-ingresos">
          <button className="btn-agregar-ingresos">
            <FaPlusCircle className="btn-ingresos-icon" />
            Agregar Categorías
          </button>
        </Link>
      </div>

      <ListadoIngresos />

      <div className="tabla-container">
        {error ? (
          <div className="error-message">{error}</div>
        ) : (
          <ListaCategorias categorias={categorias} />
        )}
      </div>
    </>
  );
};
