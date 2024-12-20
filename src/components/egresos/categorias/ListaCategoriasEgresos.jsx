import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import "./ListaCategoriasEgresos.scss";

export const ListaCategoriasEgresos = ({ categorias }) => {
  const ordenarCategorias = (cats) => {
    const compararCodigos = (a, b) => {
      const partsA = a.codigo.split(".").map(Number);
      const partsB = b.codigo.split(".").map(Number);

      for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
        const numA = partsA[i] || 0;
        const numB = partsB[i] || 0;
        if (numA !== numB) return numA - numB;
      }
      return 0;
    };

    return [...cats].sort(compararCodigos);
  };

  const categoriasOrdenadas = ordenarCategorias(categorias);

  return (
    <>
      <Typography variant="h6" gutterBottom className="lista-categorias-titulo">
        Categorías de Gastos Existentes
      </Typography>

      <TableContainer component={Paper} className="tabla-categorias">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="tabla-header">Código</TableCell>
              <TableCell className="tabla-header">Nombre</TableCell>
              <TableCell className="tabla-header">Categoría Padre</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categoriasOrdenadas.map((categoria) => (
              <TableRow key={categoria._id} className="tabla-row">
                <TableCell className="tabla-cell">{categoria.codigo}</TableCell>
                <TableCell className="tabla-cell">{categoria.nombre}</TableCell>
                <TableCell className="tabla-cell">
                  {categoria.categoriaPadre || "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

ListaCategoriasEgresos.propTypes = {
  categorias: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      codigo: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
      nivel: PropTypes.number.isRequired,
      categoriaPadre: PropTypes.string,
    })
  ).isRequired,
};
