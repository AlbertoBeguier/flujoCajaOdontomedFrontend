import { useState, useEffect } from "react";
import { Box, Paper, Button } from "@mui/material";
import { getListasMaestras } from "../../services/listaMaestraService";
import "./GestionListasMaestras.scss";

export const GestionListasMaestras = () => {
  const [listas, setListas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    cargarListas();
  }, []);

  const cargarListas = async () => {
    try {
      setIsLoading(true);
      const data = await getListasMaestras();
      setListas(data);
    } catch (error) {
      console.error("Error al cargar listas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="listas-maestras-container">
      <h1>Gestión de Listas Maestras</h1>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          /* Abrir modal para nueva lista */
        }}
      >
        Nueva Lista
      </Button>

      {isLoading ? (
        <p>Cargando...</p>
      ) : (
        <div className="listas-grid">
          {listas.map((lista) => (
            <Paper key={lista.id} className="lista-card">
              <h3>{lista.nombre}</h3>
              <p>{lista.descripcion}</p>
              <div className="items-list">
                {lista.items?.map((item) => (
                  <div key={item.id} className="item">
                    {item.nombre}
                  </div>
                ))}
              </div>
            </Paper>
          ))}
        </div>
      )}
    </Box>
  );
};
