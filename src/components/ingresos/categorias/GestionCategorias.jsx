import { useState, useEffect } from "react";
import { Box, Paper, Typography, Alert, Snackbar } from "@mui/material";
import { FormularioCategoria } from "./FormularioCategoria";
import { ListaCategorias } from "./ListaCategorias";
import "./GestionCategorias.css";

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
    <Box className="categorias-container">
      <Paper className="formulario-categoria">
        <Typography
          variant="h6"
          gutterBottom
          className="gestion-categorias-titulo"
        >
          Nueva Categoría
        </Typography>
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
  );
};
