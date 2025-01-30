import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getEgresos } from "../../../services/egresosService";
import { FaPencilAlt } from "react-icons/fa";
import "./ListadoEgresos.scss";
import { EgresosDatosAdicionales } from "./EgresosDatosAdicionales";
import { useSubcategoriasEgresos } from "../../../hooks/useSubcategoriasEgresos";

export const ListadoEgresos = ({ ultimoEgresoId }) => {
  const [egresos, setEgresos] = useState([]);
  const [error, setError] = useState("");
  const [egresoSeleccionado, setEgresoSeleccionado] = useState(null);
  const { subcategorias } = useSubcategoriasEgresos();

  useEffect(() => {
    const cargarEgresos = async () => {
      try {
        const data = await getEgresos();
        setEgresos(data);
      } catch (err) {
        console.error("Error al cargar egresos:", err);
        setError("Error al cargar los egresos");
      }
    };

    cargarEgresos();
  }, [ultimoEgresoId]);

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

  const handleClickLapiz = (egreso) => {
    setEgresoSeleccionado(egreso);
  };

  if (error) {
    return <div className="error-mensaje">{error}</div>;
  }

  return (
    <div className="listado-egresos-container">
      <h3 className="listado-titulo">Últimos Egresos Registrados</h3>
      <div className="tabla-responsive">
        <table className="tabla-egresos">
          <thead>
            <tr>
              <th>FECHA</th>
              <th>CATEGORÍA</th>
              <th>SUBCATEGORÍA</th>
              <th>IMPORTE</th>
              <th>ACCIONES</th>
              <th>OBS</th>
            </tr>
          </thead>
          <tbody>
            {egresos.map((egreso) => (
              <tr
                key={egreso._id}
                className={egreso._id === ultimoEgresoId ? "nuevo-egreso" : ""}
              >
                <td>{formatearFecha(egreso.fecha)}</td>
                <td>{egreso.categoria.nombre}</td>
                <td>
                  {egreso.subcategoria ? (
                    <div className="subcategoria-container">
                      <span className="subcategoria-cell">
                        {egreso.subcategoria.nombre}
                      </span>
                      <div className="subcategoria-tooltip">
                        <div className="tooltip-content">
                          {(() => {
                            const rutaCategoria = egreso.categoria.rutaCategoria
                              .map((cat) => cat.nombre)
                              .join(" → ");

                            const rutaSubcategoria = [];
                            let actual = subcategorias.find(
                              (s) => s.codigo === egreso.subcategoria.codigo
                            );

                            while (actual) {
                              rutaSubcategoria.unshift(actual.nombre);
                              actual = subcategorias.find(
                                (s) => s.codigo === actual.categoriaPadre
                              );
                            }

                            return `${rutaCategoria} → ${rutaSubcategoria.join(
                              " → "
                            )}`;
                          })()}
                        </div>
                      </div>
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="importe">{formatearImporte(egreso.importe)}</td>
                <td className="acciones">
                  <button
                    className="btn-accion"
                    onClick={() => handleClickLapiz(egreso)}
                  >
                    <FaPencilAlt />
                  </button>
                </td>
                <td className="observaciones">
                  {egreso.observaciones?.trim() ? (
                    <span
                      className="tiene-obs"
                      title={egreso.observaciones}
                      onClick={() => handleClickLapiz(egreso)}
                    >
                      Sí
                    </span>
                  ) : (
                    "No"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {egresoSeleccionado && (
        <EgresosDatosAdicionales
          egreso={egresoSeleccionado}
          onClose={() => setEgresoSeleccionado(null)}
          onUpdate={cargarEgresos}
        />
      )}
    </div>
  );
};

ListadoEgresos.propTypes = {
  ultimoEgresoId: PropTypes.string,
};
