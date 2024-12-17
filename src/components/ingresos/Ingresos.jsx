import { useState, useEffect } from "react";
import logo from "../../assets/odontomed512_512.png";
import logo1 from "../../assets/odontomedBigLogo.png";
import "./Ingresos.scss";
import { FaPlusCircle, FaCashRegister } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ListaCategorias } from "./categorias/ListaCategorias";
import { API_BASE_URL } from "../../config/constants";

export const Ingresos = () => {
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        console.log('Intentando conectar a:', `${API_BASE_URL}/api/categorias-ingresos`);
        const response = await fetch(
          `${API_BASE_URL}/api/categorias-ingresos`
        );
        console.log('Estado de la respuesta:', response.status);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Datos del error:', errorData);
          throw new Error(`Error al cargar las categorías: ${errorData.mensaje || response.statusText}`);
        }
        const data = await response.json();
        console.log('Datos recibidos:', data);
        setCategorias(data);
      } catch (err) {
        console.error("Error completo:", err);
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
        <p className="ingresos-titulo">Ingresos</p>
      </div>

      <div className="pagina-ingresos-container">
        <Link to="/registar-ingresos">
          <button className="btn-reg-ingresos">
            <FaCashRegister className="btn-ingresos-icon" />
            Registrar Ingresos
          </button>{" "}
        </Link>
        <Link to="/agregar-ingresos">
          <button className="btn-agregar-ingresos">
            <FaPlusCircle className="btn-ingresos-icon" />
            Agregar Categorías
          </button>
        </Link>
      </div>

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
