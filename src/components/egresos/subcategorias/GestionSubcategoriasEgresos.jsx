import { useState, useEffect } from "react";
import { Box, Paper, Alert, Snackbar } from "@mui/material";
import { FormularioSubcategoriaEgresos } from "./FormularioSubcategoriaEgresos";
import { ListaSubcategorias } from "./ListaSubcategorias";
import logo from "../../../assets/odontomed512_512.png";
import logo1 from "../../../assets/odontomedBigLogo.png";
import "./GestionSubcategoriasEgresos.scss";
import { getSubcategoriasEgresos } from "../../../services/subcategoriaEgresosService";

export const GestionSubcategoriasEgresos = () => {
  const [subcategorias, setSubcategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchSubcategorias = async () => {
    try {
      setIsLoading(true);
      const data = await getSubcategoriasEgresos();
      setSubcategorias(data);
    } catch (error) {
      console.error("Error al cargar subcategorías:", error);
      setNotification({
        open: true,
        message: "El sistema de subcategorías está en mantenimiento",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubcategorias();
  }, []);

  const handleSubcategoriaCreada = async () => {
    await fetchSubcategorias();
    setNotification({
      open: true,
      message: "Subcategoría creada exitosamente",
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
        <p className="egresos-titulo">Registro de subcategorías de gastos</p>
      </div>
      <Box className="subcategorias-container">
        <Paper className="formulario-subcategoria">
          <FormularioSubcategoriaEgresos
            onSubcategoriaCreada={handleSubcategoriaCreada}
            subcategorias={subcategorias}
          />
        </Paper>

        <Paper className="tabla-subcategorias">
          {isLoading ? (
            <p className="mensaje-carga">Cargando subcategorías...</p>
          ) : subcategorias.length === 0 ? (
            <p className="mensaje-vacio">No hay subcategorías registradas</p>
          ) : (
            <ListaSubcategorias subcategorias={subcategorias} />
          )}
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
