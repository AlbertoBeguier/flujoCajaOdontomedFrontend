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
import "./ListaSubcategorias.scss";

export const ListaSubcategorias = ({ subcategorias }) => {
  return (
    <div className="lista-subcategorias-container">
      <Typography variant="h6" className="lista-subcategorias-titulo">
        Subcategorías de Ingresos Existentes
      </Typography>

      <TableContainer component={Paper} className="tabla-subcategorias">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Categoría Padre</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subcategorias.map((subcategoria) => (
              <TableRow key={subcategoria._id}>
                <TableCell>{subcategoria.codigo}</TableCell>
                <TableCell>{subcategoria.nombre}</TableCell>
                <TableCell>
                  {subcategoria.categoriaPadre || "Categoría Principal"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

ListaSubcategorias.propTypes = {
  subcategorias: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      codigo: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
      nivel: PropTypes.number.isRequired,
      categoriaPadre: PropTypes.string,
    })
  ).isRequired,
};
