import { useState, useCallback, useEffect } from "react";
import { Box, Paper, Alert, Snackbar } from "@mui/material";
import { ListaSubcategorias } from "./ListaSubcategorias";
import { ModalSubcategoria } from "./ModalSubcategoria";
import logo from "../../../assets/odontomed512_512.png";
import logo1 from "../../../assets/odontomedBigLogo.png";
import "./GestionSubcategoriasEgresos.scss";
import {
  getSubcategoriasEgresos,
  createSubcategoriaEgreso,
  sincronizarTodasLasSubcategorias,
  convertirListaASubcategorias,
  analizarEstructuraSubcategorias,
  sincronizarListaMaestra,
  descargarBackup,
} from "../../../services/subcategoriaEgresosService";

export const GestionSubcategoriasEgresos = () => {
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
      console.log("Iniciando carga de subcategorías...");
      setIsLoading(true);
      const data = await getSubcategoriasEgresos();
      console.log("Datos recibidos en el componente:", data);
      setSubcategorias(Array.isArray(data) ? data : []);
      console.log("Estado actualizado:", Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar subcategorías:", error);
      setSubcategorias([]);
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

  const handleSubmitSubcategoria = async (formData) => {
    try {
      console.log("FormData recibido:", formData);
      console.log("ModalConfig:", modalConfig);

      // Validación según el tipo de datos
      if (formData.tipo === "lista") {
        if (!formData.datos.codigo || !formData.datos.listaId) {
          throw new Error("Se requiere el código y la lista seleccionada");
        }
        await convertirListaASubcategorias(
          formData.datos.codigo,
          formData.datos.listaId
        );
      } else {
        // Validación para subcategorías normales
        if (!formData.datos.codigo || !formData.datos.nombre) {
          throw new Error("El código y nombre son requeridos");
        }
        await createSubcategoriaEgreso(formData);
      }

      setNotification({
        open: true,
        message: "Operación realizada exitosamente",
        severity: "success",
      });

      handleCloseModal();
      cargarSubcategorias();
    } catch (error) {
      console.error("Error detallado:", error);
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

    if (codigosPrincipales.length === 0) return "1";
    return (Math.max(...codigosPrincipales) + 1).toString();
  };

  const obtenerSiguienteCodigoHijo = (codigoPadre) => {
    const codigosHijos = subcategorias
      .filter((sub) => sub.categoriaPadre === codigoPadre)
      .map((sub) => parseInt(sub.codigo.split(".").pop()))
      .filter((codigo) => !isNaN(codigo));

    if (codigosHijos.length === 0) return `${codigoPadre}.1`;
    return `${codigoPadre}.${Math.max(...codigosHijos) + 1}`;
  };

  const handleSincronizar = async () => {
    try {
      setIsLoading(true);

      // 1. Primero analizar la estructura completa del árbol
      const estructuraAnalizada = await analizarEstructuraSubcategorias();

      // Verificar que la estructura sea válida antes de continuar
      if (!estructuraAnalizada || estructuraAnalizada.length === 0) {
        throw new Error("La estructura del árbol está vacía o es inválida");
      }

      // 2. Sincronizar toda la estructura jerárquica
      await sincronizarTodasLasSubcategorias();

      // 3. Obtener todas las subcategorías actualizadas
      const todasLasSubcategorias = await getSubcategoriasEgresos();

      // 4. Sincronizar todas las subcategorías que tengan lista maestra
      const subcategoriasConLista = todasLasSubcategorias.filter(
        (sub) => sub.listaMaestra
      );

      // 5. Sincronizar cada subcategoría con su lista maestra correspondiente
      for (const subcategoria of subcategoriasConLista) {
        await sincronizarListaMaestra(subcategoria.codigo);
      }

      // 6. Recargar los datos actualizados
      await cargarSubcategorias();

      setNotification({
        open: true,
        message:
          "Sincronización completa de toda la estructura realizada con éxito",
        severity: "success",
      });
    } catch (error) {
      console.error("Error en la sincronización:", error);
      setNotification({
        open: true,
        message: "Error al sincronizar la estructura: " + error.message,
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
        message: "Copia de seguridad descargada con éxito",
        severity: "success",
      });
    } catch (error) {
      console.error("Error al descargar la copia de seguridad:", error);
      setNotification({
        open: true,
        message: "Error al descargar la copia de seguridad",
        severity: "error",
      });
    }
  };

  return (
    <>
      <div className="egresos-pagina-container-1">
        <img src={logo} alt="Logo" className="egresos-logo" />
        <img src={logo1} alt="Logo1" className="egresos-logo-1" />
        <p className="egresos-titulo">Registro de subcategorías de egresos</p>
        <button
          className="egresos-btn-sincronizar"
          onClick={handleSincronizar}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              Sincronizando
              <div className="egresos-spinner"></div>
            </>
          ) : (
            "Sincronizar Todo"
          )}
        </button>
        <button
          className="egresos-btn-backup"
          onClick={handleBackup}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              Generando Backup
              <div className="egresos-spinner"></div>
            </>
          ) : (
            "Copia de Seguridad"
          )}
        </button>
      </div>

      <Box className="egresos-subcategorias-container">
        <Paper className="egresos-tabla-subcategorias">
          {isLoading ? (
            <p className="egresos-mensaje-carga">Cargando subcategorías...</p>
          ) : !subcategorias || subcategorias.length === 0 ? (
            <div className="egresos-contenedor-vacio">
              <p className="egresos-mensaje-vacio">
                No hay subcategorías registradas
              </p>
              <button
                className="egresos-btn-agregar-inicial"
                onClick={handleAgregarPrincipal}
              >
                + Agregar Primera Categoría
              </button>
            </div>
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
