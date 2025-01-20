import PropTypes from "prop-types";
import { memo } from "react";

const TablaResumenComponent = ({
  ingresos,
  filtros,
  categoriaSeleccionada,
  subcategoriaSeleccionada,
  esFiltrado = false,
}) => {
  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    const options = {
      timeZone: "America/Argentina/Buenos_Aires",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    return date.toLocaleDateString("es-AR", options);
  };

  const formatearImporte = (importe) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(importe);
  };

  const MESES = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const obtenerNombreMes = (numeroMes) => MESES[numeroMes];

  const calcularTotal = () => {
    return ingresos.reduce((total, ingreso) => total + ingreso.importe, 0);
  };

  return (
    <>
      <table className="dashboard-tabla">
        <thead>
          <tr>
            <th>FECHA</th>
            <th>CATEGORÍA</th>
            <th>SUBCATEGORÍA</th>
            <th>IMPORTE</th>
          </tr>
        </thead>
        <tbody>
          {ingresos.map((ingreso) => (
            <tr key={ingreso._id}>
              <td>{formatearFecha(ingreso.fecha)}</td>
              <td>
                <div className="categoria-container">
                  <span className="categoria-cell">
                    {ingreso.categoria.nombre}
                  </span>
                  <div className="categoria-tooltip">
                    <div className="tooltip-content">
                      {ingreso.categoria.rutaCategoria
                        .map((cat) => cat.nombre)
                        .join(" → ")}
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <div className="categoria-container">
                  <span className="categoria-cell">
                    {ingreso.subcategoria?.nombre || "-"}
                  </span>
                  {ingreso.subcategoria?.rutaSubcategoria && (
                    <div className="categoria-tooltip">
                      <div className="tooltip-content">
                        {ingreso.subcategoria.rutaSubcategoria
                          .map((sub) => sub.nombre)
                          .join(" → ")}
                      </div>
                    </div>
                  )}
                </div>
              </td>
              <td className="importe">{formatearImporte(ingreso.importe)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="dashboard-total">
        <span className="periodo-total">
          Período: {filtros.diaDesde} de {obtenerNombreMes(filtros.mesDesde)}{" "}
          {filtros.anioDesde} - {filtros.diaHasta} de{" "}
          {obtenerNombreMes(filtros.mesHasta)} {filtros.anioHasta}
        </span>
        {categoriaSeleccionada && subcategoriaSeleccionada && (
          <span className="periodo-total">
            Categoría:{" "}
            {categoriaSeleccionada === "TODAS"
              ? "TODAS"
              : ingresos[0]?.categoria.rutaCategoria
                  .slice(
                    0,
                    ingresos[0]?.categoria.rutaCategoria.findIndex(
                      (cat) => cat.nombre === categoriaSeleccionada
                    ) + 1
                  )
                  .map((cat) => cat.nombre)
                  .join(" → ")}{" "}
            | Subcategoría:{" "}
            {subcategoriaSeleccionada === "TODAS"
              ? "TODAS"
              : ingresos[0]?.subcategoria?.rutaSubcategoria
                  ?.slice(
                    0,
                    ingresos[0]?.subcategoria.rutaSubcategoria.findIndex(
                      (sub) => sub.nombre === subcategoriaSeleccionada
                    ) + 1
                  )
                  .map((sub) => sub.nombre)
                  .join(" → ")}
          </span>
        )}
        <div className="total-general" style={{ textAlign: "center" }}>
          {esFiltrado ? "Total Filtrado: " : "Total General: "}
          {formatearImporte(calcularTotal())}
        </div>
      </div>
    </>
  );
};

TablaResumenComponent.propTypes = {
  ingresos: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      fecha: PropTypes.string.isRequired,
      importe: PropTypes.number.isRequired,
      categoria: PropTypes.shape({
        nombre: PropTypes.string.isRequired,
        rutaCategoria: PropTypes.arrayOf(
          PropTypes.shape({
            nombre: PropTypes.string.isRequired,
          })
        ).isRequired,
      }).isRequired,
      subcategoria: PropTypes.shape({
        nombre: PropTypes.string,
        rutaSubcategoria: PropTypes.arrayOf(
          PropTypes.shape({
            nombre: PropTypes.string.isRequired,
          })
        ),
      }),
    })
  ).isRequired,
  filtros: PropTypes.shape({
    diaDesde: PropTypes.number.isRequired,
    mesDesde: PropTypes.number.isRequired,
    anioDesde: PropTypes.number.isRequired,
    diaHasta: PropTypes.number.isRequired,
    mesHasta: PropTypes.number.isRequired,
    anioHasta: PropTypes.number.isRequired,
  }).isRequired,
  categoriaSeleccionada: PropTypes.string,
  subcategoriaSeleccionada: PropTypes.string,
  esFiltrado: PropTypes.bool,
};

TablaResumenComponent.displayName = "TablaResumen";

export const TablaResumen = memo(TablaResumenComponent);
