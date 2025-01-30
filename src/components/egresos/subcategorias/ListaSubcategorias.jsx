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
        <div className={`egresos-subcategoria-nivel-${nivel}`}>
          {tieneHijos && (
            <span
              className="egresos-expandir-btn"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpansion(subcategoria.codigo);
              }}
            >
              {estaExpandida ? "└" : "├"}
            </span>
          )}
          <span
            className="egresos-subcategoria-contenido"
            onClick={() => onVerSubcategorias(subcategoria)}
          >
            {subcategoria.nombre} ({subcategoria.codigo})
          </span>
          <span
            className="egresos-agregar-btn"
            onClick={(e) => handleAgregarClick(subcategoria, e)}
          >
            [+]
          </span>
        </div>
        {estaExpandida && tieneHijos && (
          <div className="egresos-subcategorias-hijos">
            {subcategorias
              .filter((sub) => sub.categoriaPadre === subcategoria.codigo)
              .map((subcat) => renderSubcategoria(subcat))}
          </div>
        )}
      </div>
    );
  };

  const renderTabla = () => {
    return (
      <Table className="egresos-tabla">
        <TableHead>
          <TableRow>
            <TableCell className="egresos-tabla-header">Código</TableCell>
            <TableCell className="egresos-tabla-header">Nombre</TableCell>
            <TableCell className="egresos-tabla-header">Nivel</TableCell>
            <TableCell className="egresos-tabla-header">Acciones</TableCell>
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

  const renderFilaTabla = (subcategoria) => {
    const tieneHijos = subcategorias.some(
      (sub) => sub.categoriaPadre === subcategoria.codigo
    );
    const estaExpandida = expandidas.has(subcategoria.codigo);
    const nivel = subcategoria.codigo.split(".").length - 1;

    return (
      <React.Fragment key={subcategoria.codigo}>
        <TableRow className="egresos-tabla-fila">
          <TableCell className="egresos-tabla-celda">
            {nivel > 0 && "\u00A0\u00A0".repeat(nivel)}
            {tieneHijos && (
              <span
                className="egresos-expandir-btn"
                onClick={(e) => toggleExpansion(subcategoria.codigo, e)}
              >
                {estaExpandida ? "└" : "├"}
              </span>
            )}
            {subcategoria.codigo}
          </TableCell>
          <TableCell className="egresos-tabla-celda">
            {subcategoria.nombre}
          </TableCell>
          <TableCell className="egresos-tabla-celda-centro">{nivel}</TableCell>
          <TableCell className="egresos-tabla-celda-centro">
            <button
              className="egresos-agregar-btn-tabla"
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

  // Validación inicial
  if (!Array.isArray(subcategorias) || subcategorias.length === 0) {
    return (
      <div className="egresos-lista-vacia">
        <p>No hay subcategorías para mostrar</p>
        <button
          className="egresos-agregar-principal-btn"
          onClick={onAgregarPrincipal}
        >
          + Nueva Categoría Principal
        </button>
      </div>
    );
  }

  return (
    <div className="egresos-lista-container">
      <div className="egresos-encabezado">
        <h2 className="egresos-titulo-1">Subcategorías de Egresos</h2>
        <button
          className="egresos-toggle-vista-btn"
          onClick={() => setVistaArbol(!vistaArbol)}
        >
          {vistaArbol ? "Ver Lista" : "Ver Árbol"}
        </button>
      </div>

      <div className="egresos-botones-principales">
        <button
          className="egresos-agregar-principal-btn"
          onClick={onAgregarPrincipal}
        >
          + Nueva Categoría Principal
        </button>
        <button
          className="egresos-gestionar-listas-btn"
          onClick={() => navigate("/listas-maestras")}
        >
          + Gestión de Listas Maestras
        </button>
      </div>

      {vistaArbol ? (
        <div className="egresos-arbol-estructura">
          {subcategorias
            .filter((sub) => !sub.categoriaPadre)
            .map((subcategoria) => renderSubcategoria(subcategoria))}
        </div>
      ) : (
        <div className="egresos-tabla-contenedor">{renderTabla()}</div>
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
