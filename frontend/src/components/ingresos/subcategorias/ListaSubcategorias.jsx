import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import "./ListaSubcategorias.scss";
import { useNavigate } from "react-router-dom";

export const ListaSubcategorias = ({
  subcategorias,
  onVerSubcategorias = () => {},
  onAgregarSubcategoria,
  onAgregarPrincipal,
}) => {
  const [expandidas, setExpandidas] = useState(new Set());
  const [vistaArbol, setVistaArbol] = useState(true);
  const navigate = useNavigate();

  const toggleExpansion = (codigo, e) => {
    e?.stopPropagation();
    const nuevasExpandidas = new Set(expandidas);
    if (expandidas.has(codigo)) {
      nuevasExpandidas.delete(codigo);
    } else {
      nuevasExpandidas.add(codigo);
    }
    setExpandidas(nuevasExpandidas);
  };

  const handleAgregarClick = (subcategoria, e) => {
    e?.stopPropagation();
    console.log("Subcategoría seleccionada:", subcategoria); // Para debug
    onAgregarSubcategoria(subcategoria);
  };

  const renderSubcategoria = (subcategoria) => {
    const nivel = subcategoria.codigo.split(".").length - 1;
    const tieneHijos = subcategorias.some(
      (sub) => sub.categoriaPadre === subcategoria.codigo
    );
    const estaExpandida = expandidas.has(subcategoria.codigo);

    return (
      <div key={subcategoria.codigo}>
        <div className={`categoria-nivel-${nivel}`}>
          {tieneHijos && (
            <span
              className="btn-expandir"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpansion(subcategoria.codigo);
              }}
            >
              {estaExpandida ? "└" : "├"}
            </span>
          )}
          <span
            className="categoria-contenido"
            onClick={() => onVerSubcategorias(subcategoria)}
          >
            {subcategoria.nombre} ({subcategoria.codigo})
          </span>
          <span
            className="btn-agregar"
            onClick={(e) => {
              e.stopPropagation();
              handleAgregarClick(subcategoria);
            }}
          >
            [+]
          </span>
        </div>
        {estaExpandida && tieneHijos && (
          <div>
            {subcategorias
              .filter((sub) => sub.categoriaPadre === subcategoria.codigo)
              .map((subcat) => renderSubcategoria(subcat))}
          </div>
        )}
      </div>
    );
  };

  const renderTabla = () => {
    const renderFilaTabla = (subcategoria) => {
      const tieneHijos = subcategorias.some(
        (sub) => sub.categoriaPadre === subcategoria.codigo
      );
      const estaExpandida = expandidas.has(subcategoria.codigo);
      const nivel = subcategoria.codigo.split(".").length - 1;

      return (
        <React.Fragment key={subcategoria.codigo}>
          <TableRow>
            <TableCell>
              {nivel > 0 && "\u00A0\u00A0".repeat(nivel)}
              {tieneHijos && (
                <span
                  className="btn-expandir"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpansion(subcategoria.codigo);
                  }}
                >
                  {estaExpandida ? "└" : "├"}
                </span>
              )}
              {subcategoria.codigo}
            </TableCell>
            <TableCell>{subcategoria.nombre}</TableCell>
            <TableCell align="center">{nivel}</TableCell>
            <TableCell align="center">
              <button
                className="btn-agregar-tabla"
                onClick={() => handleAgregarClick(subcategoria)}
              >
                +
              </button>
            </TableCell>
          </TableRow>
          {estaExpandida &&
            tieneHijos &&
            subcategorias
              .filter((sub) => sub.categoriaPadre === subcategoria.codigo)
              .map((subcat) => renderFilaTabla(subcat))}
        </React.Fragment>
      );
    };

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Código</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Nivel</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subcategorias
            .filter((sub) => !sub.categoriaPadre)
            .map((subcategoria) => renderFilaTabla(subcategoria))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="lista-subcategorias-container">
      <div className="header-container">
        <h2 className="titulo-lista">Subcategorías de Ingresos</h2>
        <button
          className="btn-toggle-view"
          onClick={() => setVistaArbol(!vistaArbol)}
        >
          {vistaArbol ? "Ver Lista" : "Ver Árbol"}
        </button>
      </div>

      <div className="botones-container">
        <button
          className="btn-agregar-principal-small"
          onClick={onAgregarPrincipal}
        >
          + Nueva Categoría Principal
        </button>
        <button
          className="btn-agregar-principal-small"
          onClick={() => navigate("/listas-maestras")}
        >
          + Gestión de Listas Maestras
        </button>
      </div>

      {vistaArbol ? (
        <div className="arbol-estructura-completo">
          {subcategorias
            .filter((sub) => !sub.categoriaPadre)
            .map((subcategoria) => renderSubcategoria(subcategoria))}
        </div>
      ) : (
        <div className="tabla-subcategorias">{renderTabla()}</div>
      )}
    </div>
  );
};

ListaSubcategorias.propTypes = {
  subcategorias: PropTypes.arrayOf(
    PropTypes.shape({
      codigo: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
      nivel: PropTypes.number.isRequired,
      categoriaPadre: PropTypes.string,
    })
  ).isRequired,
  onVerSubcategorias: PropTypes.func,
  onAgregarSubcategoria: PropTypes.func.isRequired,
  onAgregarPrincipal: PropTypes.func.isRequired,
};
