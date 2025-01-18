import { useState, useEffect } from "react";
import { Box, Paper, Alert, Snackbar } from "@mui/material";
import { FormularioCategoriaEgresos } from "./FormularioCategoriaEgresos";
import { ListaCategorias } from "./ListaCategorias";
import logo from "../../../assets/odontomed512_512.png";
import logo1 from "../../../assets/odontomedBigLogo.png";
import "./GestionCategoriasEgresos.scss";
import { API_BASE_URL } from "../../../config/constants";

export const GestionCategoriasEgresos = () => {
  const [categorias, setCategorias] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchCategorias = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categorias-egresos`);
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
      setNotification({
        open: true,
        message: "Error al cargar las categorías",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleCategoriaCreada = async () => {
    await fetchCategorias();
    setNotification({
      open: true,
      message: "Categoría creada exitosamente",
      severity: "success",
    });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <>
      <div className="pagina-egresos-container-1">
        <img src={logo} alt="Logo" className="egresos-logo" />
        <img src={logo1} alt="Logo1" className="egresos-logo-1" />
        <p className="egresos-titulo">Registro de categorías de egresos</p>
      </div>
      <Box className="categorias-container">
        <Paper className="formulario-categoria">
          <FormularioCategoriaEgresos
            onCategoriaCreada={handleCategoriaCreada}
            categorias={categorias}
          />
        </Paper>

        <Paper className="tabla-categorias">
          <ListaCategorias categorias={categorias} />
        </Paper>

        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          className="notification"
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            className={`alerta-${notification.severity}`}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};
