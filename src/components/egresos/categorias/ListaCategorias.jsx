import { useCategoriasEgresos } from "../../../hooks/useCategoriasEgresos";
import "./ListaCategorias.scss";

export const ListaCategorias = () => {
  const { categorias } = useCategoriasEgresos();

  return (
    <div className="lista-categorias-wrapper">
      <h2 className="lista-categorias-titulo">
        Categorías de Egresos Existentes
      </h2>
      <table className="tabla-categorias">
        <thead>
          <tr>
            <th className="tabla-header">Código</th>
            <th className="tabla-header">Nombre</th>
            <th className="tabla-header">Categoría Padre</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((categoria) => (
            <tr key={categoria._id}>
              <td className="tabla-cell">{categoria.codigo}</td>
              <td className="tabla-cell">{categoria.nombre}</td>
              <td className="tabla-cell">{categoria.categoriaPadre || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
