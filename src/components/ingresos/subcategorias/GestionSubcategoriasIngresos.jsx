import { useState, useEffect } from "react";
import { Box, Paper, Alert, Snackbar } from "@mui/material";
import { FormularioSubcategoriaIngresos } from "./FormularioSubcategoriaIngresos";
import { ListaSubcategorias } from "./ListaSubcategorias";
import logo from "../../../assets/odontomed512_512.png";
import logo1 from "../../../assets/odontomedBigLogo.png";
import "./GestionSubcategoriasIngresos.scss";
import { getSubcategoriasIngresos } from "../../../services/subcategoriaIngresosService";

export const GestionSubcategoriasIngresos = () => {
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
      const data = await getSubcategoriasIngresos();
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
      <div className="pagina-ingresos-container-1">
        <img src={logo} alt="Logo" className="ingresos-logo" />
        <img src={logo1} alt="Logo1" className="ingresos-logo-1" />
        <p className="ingresos-titulo">Registro de subcategorías de ingresos</p>
      </div>
      <Box className="subcategorias-container">
        <Paper className="formulario-subcategoria">
          <FormularioSubcategoriaIngresos
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
