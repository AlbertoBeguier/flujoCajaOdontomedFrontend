import { useState } from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import "./ListaSubcategorias.scss";
import { Fragment } from "react";

export const ListaSubcategorias = ({ subcategorias }) => {
  const [showTree, setShowTree] = useState(true);

  // Ordenar subcategorías para la tabla
  const subcategoriasOrdenadas = [...subcategorias].sort((a, b) =>
    a.codigo.localeCompare(b.codigo)
  );

  const construirArbolCompleto = () => {
    const categoriasRaiz = subcategorias.filter((sub) => !sub.categoriaPadre);
    let estructura = "";

    const construirRamas = (subcat, prefijo = "") => {
      const hijos = subcategorias.filter(
        (sub) => sub.categoriaPadre === subcat.codigo
      );

      hijos.forEach((hijo, index) => {
        const esUltimo = index === hijos.length - 1;
        const prefijoActual = esUltimo ? "└── " : "├── ";
        const prefijoSiguiente = esUltimo ? "    " : "│   ";
        const nivel = hijo.codigo.split(".").length - 1;

        estructura += `${prefijo}<span class="categoria-nivel-${nivel}">${prefijoActual}${hijo.nombre} (${hijo.codigo})</span>\n`;
        construirRamas(
          hijo,
          prefijo +
            `<span class="categoria-nivel-${nivel}">${prefijoSiguiente}</span>`
        );
      });
    };

    categoriasRaiz.forEach((raiz, index) => {
      const esUltimo = index === categoriasRaiz.length - 1;
      const prefijoActual = esUltimo ? "└── " : "├── ";
      estructura += `<span class="categoria-nivel-0">${prefijoActual}${raiz.nombre} (${raiz.codigo})</span>\n`;
      construirRamas(
        raiz,
        esUltimo
          ? '<span class="categoria-nivel-0">    </span>'
          : '<span class="categoria-nivel-0">│   </span>'
      );
    });

    return estructura;
  };

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
      <div className="header-container">
        <p className="titulo-lista">Subcategorías de Ingresos Existentes</p>
        <button
          className="btn-toggle-view"
          onClick={() => setShowTree(!showTree)}
        >
          {showTree ? "Ver tabla" : "Ver árbol"}
        </button>
      </div>

      {showTree ? (
        <pre
          className="arbol-estructura-completo"
          dangerouslySetInnerHTML={{ __html: construirArbolCompleto() }}
        />
      ) : (
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
      )}
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
