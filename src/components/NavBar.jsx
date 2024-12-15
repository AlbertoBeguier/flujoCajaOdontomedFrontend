import { useState, useEffect } from "react";
import logo from "../assets/logoEstudio.png";
import logo1 from "../assets/logoEstudio1.png";
import whatsappIcon from "/whatsapp.png";
import { Link, useNavigate } from "react-router-dom";
import "../styles/NavBar.scss";
import { obtenerFechaActual } from "../utils/fechaActual";
import { Undo2, PhoneCall } from "lucide-react";

export const NavBar = () => {
  const [showContact, setShowContact] = useState(true);
  const [showDate, setShowDate] = useState(true);
  const [showLogo1, setShowLogo1] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (!showContact && !showDate) {
      timer = setTimeout(() => {
        setShowContact(true);
        setShowDate(true);
      }, 10000);
    }
    return () => clearTimeout(timer);
  }, [showContact, showDate]);

  useEffect(() => {
    const logoTimer = setInterval(() => {
      setShowLogo1((prevShowLogo1) => !prevShowLogo1);
    }, 20000); // Cambia el logo cada 20 segundos
    return () => clearInterval(logoTimer);
  }, []);

  const handleContactClick = () => {
    setShowContact(false);
    setShowDate(false);
  };

  const handleBackClick = () => {
    // Verifica si hay historial de navegación
    if (window.history.length > 2) {
      navigate(-1); // Vuelve a la página anterior
    } else {
      navigate("/"); // Redirige a la página principal si no hay historial
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg justify-content-center">
        <span className="navbar-brand logo-container">
          {/* Logo que utiliza Link para redirigir siempre a la página principal */}
          <Link to="/">
            <img
              src={logo}
              className={`d-inline-block align-top logo-img ${
                showLogo1 ? "show" : ""
              }`}
              alt="logo"
            />
            <img
              src={logo1}
              className={`d-inline-block align-top logo-img ${
                showLogo1 ? "" : "show"
              }`}
              alt="logo1"
            />
          </Link>
        </span>
        <ul className="navbar-nav">
          {showContact ? (
            <li className="nav-item">
              <span className="button-contacto" onClick={handleContactClick}>
                <PhoneCall size={30} />
              </span>
            </li>
          ) : (
            <li className="nav-item">
              <img
                src={whatsappIcon}
                alt="whatsapp"
                className="whatsapp-icon"
              />
              <span className="telefono">(+54 9 388) 4781336</span>
            </li>
          )}

          <li className="nav-item-1">
            <button onClick={handleBackClick} className="button-volver">
              <Undo2 size={30} />
            </button>
          </li>
        </ul>
        {showDate && (
          <span className="fecha-actual"> {obtenerFechaActual()}</span>
        )}
      </nav>
    </div>
  );
};
