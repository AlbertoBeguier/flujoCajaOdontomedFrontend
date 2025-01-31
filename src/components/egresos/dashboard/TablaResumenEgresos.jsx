import PropTypes from "prop-types";
import { memo } from "react";

const TablaResumenEgresosComponent = ({
  egresos,
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
    return egresos.reduce((total, egreso) => total + egreso.importe, 0);
  };

  return (
    <>
      <table className="dashboard-egresos-tabla">
        <thead>
          <tr>
            <th>FECHA</th>
            <th>CATEGORÍA</th>
            <th>SUBCATEGORÍA</th>
            <th>IMPORTE</th>
          </tr>
        </thead>
        <tbody>
          {egresos.map((egreso) => (
            <tr key={egreso._id}>
              <td>{formatearFecha(egreso.fecha)}</td>
              <td>
                <div className="categoria-egresos-container">
                  <span className="categoria-egresos-cell">
                    {egreso.categoria.nombre}
                  </span>
                  <div className="categoria-egresos-tooltip">
                    <div className="tooltip-egresos-content">
                      {egreso.categoria.rutaCategoria
                        .map((cat) => cat.nombre)
                        .join(" → ")}
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <div className="categoria-egresos-container">
                  <span className="categoria-egresos-cell">
                    {egreso.subcategoria?.nombre || "-"}
                  </span>
                  {egreso.subcategoria?.rutaSubcategoria && (
                    <div className="categoria-egresos-tooltip">
                      <div className="tooltip-egresos-content">
                        {egreso.subcategoria.rutaSubcategoria
                          .map((sub) => sub.nombre)
                          .join(" → ")}
                      </div>
                    </div>
                  )}
                </div>
              </td>
              <td className="importe">{formatearImporte(egreso.importe)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="dashboard-egresos-total">
        <span className="periodo-egresos-total">
          Período: {filtros.diaDesde} de {obtenerNombreMes(filtros.mesDesde)}{" "}
          {filtros.anioDesde} - {filtros.diaHasta} de{" "}
          {obtenerNombreMes(filtros.mesHasta)} {filtros.anioHasta}
        </span>
        {categoriaSeleccionada && subcategoriaSeleccionada && (
          <span className="periodo-egresos-total">
            Categoría:{" "}
            {categoriaSeleccionada === "TODAS"
              ? "TODAS"
              : egresos[0]?.categoria.rutaCategoria
                  .slice(
                    0,
                    egresos[0]?.categoria.rutaCategoria.findIndex(
                      (cat) => cat.nombre === categoriaSeleccionada
                    ) + 1
                  )
                  .map((cat) => cat.nombre)
                  .join(" → ")}{" "}
            | Subcategoría:{" "}
            {subcategoriaSeleccionada === "TODAS"
              ? "TODAS"
              : egresos[0]?.subcategoria?.rutaSubcategoria
                  ?.slice(
                    0,
                    egresos[0]?.subcategoria.rutaSubcategoria.findIndex(
                      (sub) => sub.nombre === subcategoriaSeleccionada
                    ) + 1
                  )
                  .map((sub) => sub.nombre)
                  .join(" → ")}
          </span>
        )}
        <div className="total-egresos-general" style={{ textAlign: "center" }}>
          {esFiltrado ? "Total Filtrado: " : "Total General: "}
          {formatearImporte(calcularTotal())}
        </div>
      </div>
    </>
  );
};

TablaResumenEgresosComponent.propTypes = {
  egresos: PropTypes.arrayOf(
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

TablaResumenEgresosComponent.displayName = "TablaResumenEgresos";

export const TablaResumenEgresos = memo(TablaResumenEgresosComponent);
