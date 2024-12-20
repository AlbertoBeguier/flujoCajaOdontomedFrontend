import { useSubcategoriasEgresos } from "../../../hooks/useSubcategoriasEgresos";
import "./ListaSubcategorias.scss";

export const ListaSubcategorias = () => {
  const { subcategorias } = useSubcategoriasEgresos();

  return (
    <div className="lista-subcategorias-wrapper">
      <h2 className="lista-subcategorias-titulo">
        Subcategorías de Gastos Existentes
      </h2>
      <table className="tabla-subcategorias">
        <thead>
          <tr>
            <th className="tabla-header">Código</th>
            <th className="tabla-header">Nombre</th>
            <th className="tabla-header">Categoría Padre</th>
          </tr>
        </thead>
        <tbody>
          {subcategorias.map((subcategoria) => (
            <tr key={subcategoria._id}>
              <td className="tabla-cell">{subcategoria.codigo}</td>
              <td className="tabla-cell">{subcategoria.nombre}</td>
              <td className="tabla-cell">
                {subcategoria.categoriaPadre || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
