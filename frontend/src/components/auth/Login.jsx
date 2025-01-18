import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import logo3 from "../../assets/odontomed512_512.png";
import logo4 from "../../assets/odontomedBigLogo.png";
import logo from "../../assets/logoEstudio.png";
import logo1 from "../../assets/logoEstudio1.png";
import "./Login.scss";

export const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showLogo1, setShowLogo1] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const logoTimer = setInterval(() => {
      setShowLogo1((prevShowLogo1) => !prevShowLogo1);
    }, 20000); // Cambia el logo cada 20 segundos
    return () => clearInterval(logoTimer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(credentials);
      navigate("/home");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <div className="estudio-logos">
            <img
              src={logo}
              className={`login-logo-estudio ${showLogo1 ? "show" : ""}`}
              alt="Logo Estudio"
            />
            <img
              src={logo1}
              className={`login-logo-estudio ${showLogo1 ? "" : "show"}`}
              alt="Logo Estudio 1"
            />
          </div>
          <div className="cliente-logos">
            <img
              src={logo3}
              alt="Logo Cliente"
              className="login-logo-cliente"
            />
            <img
              src={logo4}
              alt="Logo Cliente 1"
              className="login-logo-cliente-1"
            />
          </div>
        </div>
        <p className="login-titulo">Iniciar Sesión</p>
        {error && <div className="error-login">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Usuario"
              value={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Contraseña"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              required
            />
          </div>
          <button type="submit" className="login-button">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};
