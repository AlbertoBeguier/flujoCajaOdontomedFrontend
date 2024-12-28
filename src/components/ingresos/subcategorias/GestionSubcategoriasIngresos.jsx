import { useState, useEffect } from "react";
import { Box, Paper, Alert, Snackbar } from "@mui/material";
import { FormularioSubcategoriaIngresos } from "./FormularioSubcategoriaIngresos";
import { ListaSubcategorias } from "./ListaSubcategorias";
import { GestionLista } from "./GestionLista";
import logo from "../../../assets/odontomed512_512.png";
import logo1 from "../../../assets/odontomedBigLogo.png";
import "./GestionSubcategoriasIngresos.scss";
import { getSubcategoriasIngresos } from "../../../services/subcategoriaIngresosService";

export const GestionSubcategoriasIngresos = () => {
  const [subcategorias, setSubcategorias] = useState([]);
  const [rutaActual, setRutaActual] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mostrarModalLista, setMostrarModalLista] = useState(false);
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] =
    useState(null);
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

  const handleVerSubcategorias = (subcategoria) => {
    setRutaActual([...rutaActual, subcategoria]);
  };

  const handleGuardarLista = async (lista) => {
    try {
      await guardarListaSubcategoria(subcategoriaSeleccionada._id, lista);
      setMostrarModalLista(false);
      setSubcategoriaSeleccionada(null);
      await fetchSubcategorias();
      setNotification({
        open: true,
        message: "Lista guardada exitosamente",
        severity: "success",
      });
    } catch (error) {
      setNotification({
        open: true,
        message: "Error al guardar la lista: " + error.message,
        severity: "error",
      });
    }
  };

  const handleRutaChange = (nuevaRuta) => {
    setRutaActual(nuevaRuta);
  };

  return (
    <>
      <div className="pagina-ingresos-container-1">
        <img src={logo} alt="Logo" className="ingresos-logo" />
        <img src={logo1} alt="Logo1" className="ingresos-logo-1" />
        <p className="ingresos-titulo">Registro de subcategorías de ingresos</p>
      </div>
      <Box className="subcategorias-container">
        {rutaActual.length > 0 && (
          <div className="ruta-navegacion">
            <button
              className="btn-navegacion"
              onClick={() => setRutaActual([])}
            >
              Inicio
            </button>
            {rutaActual.map((cat) => (
              <span key={cat._id}>
                <span className="separador-ruta">›</span>
                <button
                  className="btn-navegacion"
                  onClick={() =>
                    setRutaActual(
                      rutaActual.slice(0, rutaActual.indexOf(cat) + 1)
                    )
                  }
                >
                  {cat.nombre}
                </button>
              </span>
            ))}
          </div>
        )}

        <Paper className="formulario-subcategoria">
          <FormularioSubcategoriaIngresos
            onSubcategoriaCreada={handleSubcategoriaCreada}
            subcategorias={subcategorias}
            rutaActual={rutaActual}
            onRutaChange={handleRutaChange}
          />
        </Paper>

        <Paper className="tabla-subcategorias">
          {isLoading ? (
            <p className="mensaje-carga">Cargando subcategorías...</p>
          ) : subcategorias.length === 0 ? (
            <p className="mensaje-vacio">No hay subcategorías registradas</p>
          ) : (
            <ListaSubcategorias
              subcategorias={subcategorias}
              onVerSubcategorias={handleVerSubcategorias}
            />
          )}
        </Paper>

        {mostrarModalLista && subcategoriaSeleccionada && (
          <GestionLista
            subcategoria={subcategoriaSeleccionada}
            onCerrar={() => setMostrarModalLista(false)}
            onGuardar={handleGuardarLista}
          />
        )}

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
