import { useCategoriasEgresos } from "../../../hooks/useCategoriasEgresos";
import "./ListadoCategoriasEgresos.scss";

export const ListadoCategoriasEgresos = () => {
  const { categorias } = useCategoriasEgresos();

  return (
    <div className="listado-categorias-container">
      <p className="titulo-categorias-egresos">
        Categorías de Gastos Existentes
      </p>
      <table className="tabla-categorias">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Categoría Padre</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((categoria) => (
            <tr key={categoria._id}>
              <td>{categoria.codigo}</td>
              <td>{categoria.nombre}</td>
              <td>{categoria.categoriaPadre || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
