import { useState, useEffect } from "react";
import { Box, Paper, Alert, Snackbar } from "@mui/material";
import { FormularioCategoria } from "./FormularioCategoria";
import { ListaCategorias } from "./ListaCategorias";
import logo from "../../../assets/odontomed512_512.png";
import logo1 from "../../../assets/odontomedBigLogo.png";
import "./GestionCategorias.scss";

export const GestionCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchCategorias = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/categorias-ingresos"
      );
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
      <div className="pagina-ingresos-container-1">
        <img src={logo} alt="Logo" className="ingresos-logo" />
        <img src={logo1} alt="Logo1" className="ingresos-logo-1" />
        <p className="ingresos-titulo">Registro de categorías</p>
      </div>
      <Box className="categorias-container">
        <Paper className="formulario-categoria">
          <FormularioCategoria
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
