import { useState } from "react";
import { API_BASE_URL } from "../../config/constants";
import { getAuthHeaders } from "../../services/authService";
import "./Register.scss";

export const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "user",
  });
  const [message, setMessage] = useState({ text: "", isError: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", isError: false });

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje);
      }

      setMessage({ text: "Usuario creado exitosamente", isError: false });
      setFormData({ username: "", password: "", role: "user" });
    } catch (error) {
      setMessage({ text: error.message, isError: true });
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Crear Nuevo Usuario</h2>
        {message.text && (
          <div className={`message ${message.isError ? "error" : "success"}`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Usuario"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              required
            >
              <option value="user">Usuario Normal</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <button type="submit" className="register-button">
            Crear Usuario
          </button>
        </form>
      </div>
    </div>
  );
};
