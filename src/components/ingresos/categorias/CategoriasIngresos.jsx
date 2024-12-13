import { useState, useEffect } from "react";
import { Container, Typography, Paper, Box } from "@mui/material";
import ListaCategorias from "./ListaCategorias";
import FormularioCategoria from "./FormularioCategoria";

const CategoriasIngresos = () => {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/categorias-ingresos"
        );
        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };

    fetchCategorias();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestión de Categorías de Ingresos
        </Typography>

        <Paper sx={{ p: 2, mt: 2 }}>
          <FormularioCategoria />
        </Paper>

        <Paper sx={{ p: 2, mt: 2 }}>
          <ListaCategorias categorias={categorias} />
        </Paper>
      </Box>
    </Container>
  );
};

export default CategoriasIngresos;
