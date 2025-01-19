import { useState, useCallback, useEffect } from "react";
import { Box, Paper, Alert, Snackbar } from "@mui/material";
import { ListaSubcategorias } from "./ListaSubcategorias";
import { ModalSubcategoria } from "./ModalSubcategoria";
import logo from "../../../assets/odontomed512_512.png";
import logo1 from "../../../assets/odontomedBigLogo.png";
import "./GestionSubcategoriasIngresos.scss";
import {
  getSubcategoriasIngresos,
  createSubcategoriaIngreso,
  sincronizarTodasLasSubcategorias,
  convertirListaASubcategorias,
  analizarEstructuraSubcategorias,
  sincronizarListaMaestra,
  descargarBackup,
} from "../../../services/subcategoriaIngresosService";

export const GestionSubcategoriasIngresos = () => {
  const [subcategorias, setSubcategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    codigoAsignar: "",
    isPrincipal: false,
  });
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const cargarSubcategorias = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getSubcategoriasIngresos();
      setSubcategorias(data);
    } catch (error) {
      console.error("Error al cargar subcategorías:", error);
      setNotification({
        open: true,
        message: "Error al cargar subcategorías",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarSubcategorias();
  }, [cargarSubcategorias]);

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleAgregarPrincipal = () => {
    const nextCodigo = obtenerSiguienteCodigoPrincipal();
    setModalConfig({
      isOpen: true,
      codigoAsignar: nextCodigo,
      isPrincipal: true,
    });
  };

  const handleAgregarSubcategoria = (subcategoria) => {
    console.log("Agregando subcategoría a:", subcategoria);
    console.log("Nombre de la subcategoría:", subcategoria.nombre);
    const nextCodigo = obtenerSiguienteCodigoHijo(subcategoria.codigo);
    console.log("Código generado:", nextCodigo);

    setModalConfig({
      isOpen: true,
      codigoAsignar: nextCodigo,
      isPrincipal: false,
      nombreSubcategoria: subcategoria.nombre,
    });
  };

  const handleCloseModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  const handleSubmitSubcategoria = async (subcategoriaData) => {
    try {
      if (subcategoriaData.tipo === "lista") {
        await convertirListaASubcategorias(
          subcategoriaData.datos.codigo,
          subcategoriaData.datos.listaId
        );
      } else {
        await createSubcategoriaIngreso(subcategoriaData);
      }

      await cargarSubcategorias();
      setModalConfig({ ...modalConfig, isOpen: false });
      setNotification({
        open: true,
        message: "Operación realizada exitosamente",
        severity: "success",
      });
    } catch (error) {
      console.error("Error:", error);
      setNotification({
        open: true,
        message: error.message || "Error al realizar la operación",
        severity: "error",
      });
    }
  };

  const obtenerSiguienteCodigoPrincipal = () => {
    const codigosPrincipales = subcategorias
      .filter((sub) => !sub.categoriaPadre)
      .map((sub) => parseInt(sub.codigo))
      .filter((codigo) => !isNaN(codigo));

    return codigosPrincipales.length > 0
      ? (Math.max(...codigosPrincipales) + 1).toString()
      : "1";
  };

  const obtenerSiguienteCodigoHijo = (codigoPadre) => {
    const codigosHijos = subcategorias
      .filter((sub) => sub.categoriaPadre === codigoPadre)
      .map((sub) => parseInt(sub.codigo.split(".").pop()))
      .filter((codigo) => !isNaN(codigo));

    if (codigosHijos.length === 0) {
      return `${codigoPadre}.1`;
    }

    const maxCodigoHijo = Math.max(...codigosHijos);
    return `${codigoPadre}.${maxCodigoHijo + 1}`;
  };

  const handleSincronizar = async () => {
    try {
      setIsLoading(true);

      // Primero analizar la estructura
      await analizarEstructuraSubcategorias();

      // Sincronizar todas las subcategorías
      await sincronizarTodasLasSubcategorias();

      // Buscar subcategorías con lista maestra y sincronizarlas
      const todasLasSubcategorias = await getSubcategoriasIngresos();
      const subcategoriasConLista = todasLasSubcategorias.filter(
        (sub) => sub.listaMaestra
      );

      for (const sub of subcategoriasConLista) {
        await sincronizarListaMaestra(sub.codigo);
      }

      await cargarSubcategorias();

      setNotification({
        open: true,
        message: "Sincronización completada correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error("Error:", error);
      setNotification({
        open: true,
        message: "Error en la sincronización",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackup = async () => {
    try {
      await descargarBackup();
      setNotification({
        open: true,
        message: "Copia de seguridad descargada correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error("Error:", error);
      setNotification({
        open: true,
        message: "Error al descargar la copia de seguridad",
        severity: "error",
      });
    }
  };

  return (
    <>
      <div className="pagina-ingresos-container-1">
        <img src={logo} alt="Logo" className="ingresos-logo" />
        <img src={logo1} alt="Logo1" className="ingresos-logo-1" />
        <p className="ingresos-titulo">Registro de subcategorías de ingresos</p>
        <button
          className="btn-sincronizar"
          onClick={handleSincronizar}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              Sincronizando
              <div className="spinner"></div>
            </>
          ) : (
            "Sincronizar Todo"
          )}
        </button>
        <button
          className="btn-backup"
          onClick={handleBackup}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              Generando Backup
              <div className="spinner"></div>
            </>
          ) : (
            "Copia de Seguridad"
          )}
        </button>
      </div>

      <Box className="subcategorias-container">
        <Paper className="tabla-subcategorias">
          {isLoading ? (
            <p className="mensaje-carga">Cargando subcategorías...</p>
          ) : (
            <ListaSubcategorias
              subcategorias={subcategorias}
              onAgregarSubcategoria={handleAgregarSubcategoria}
              onAgregarPrincipal={handleAgregarPrincipal}
              onVerSubcategorias={() => {}}
            />
          )}
        </Paper>

        <ModalSubcategoria
          isOpen={modalConfig.isOpen}
          onClose={handleCloseModal}
          codigoAsignar={modalConfig.codigoAsignar}
          onSubmit={handleSubmitSubcategoria}
          isPrincipal={modalConfig.isPrincipal}
          nombreSubcategoria={modalConfig.nombreSubcategoria}
        />

        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};
