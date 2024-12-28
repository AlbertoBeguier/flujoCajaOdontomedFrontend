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
import { Fragment } from "react";

export const ListaSubcategorias = ({ subcategorias }) => {
  // Verificar estructura
  const subcategoriasOrdenadas = [...subcategorias].sort((a, b) =>
    a.codigo.localeCompare(b.codigo)
  );

  const renderItems = (subcategoria) => {
    if (subcategoria.esLista && subcategoria.lista?.items?.length > 0) {
      return subcategoria.lista.items.map((item, index) => (
        <TableRow key={item._id || index} className="item-lista">
          <TableCell>{item.codigo}</TableCell>
          <TableCell>{item.nombre}</TableCell>
          <TableCell>{subcategoria.codigo}</TableCell>
        </TableRow>
      ));
    }
    return null;
  };

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
            {subcategoriasOrdenadas.map((subcategoria) => (
              <Fragment key={subcategoria._id}>
                <TableRow>
                  <TableCell>{subcategoria.codigo}</TableCell>
                  <TableCell>{subcategoria.nombre}</TableCell>
                  <TableCell>
                    {subcategoria.categoriaPadre || "Categoría Principal"}
                  </TableCell>
                </TableRow>
                {renderItems(subcategoria)}
              </Fragment>
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
