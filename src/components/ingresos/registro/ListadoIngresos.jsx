import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getIngresos } from "../../../services/ingresosService";
import { FaPencilAlt } from "react-icons/fa";
import "./ListadoIngresos.scss";
import { IngresosDatosAdicionales } from "./IngresosDatosAdicionales";

export const ListadoIngresos = ({ ultimoIngresoId }) => {
  const [ingresos, setIngresos] = useState([]);
  const [error, setError] = useState("");
  const [ingresoSeleccionado, setIngresoSeleccionado] = useState(null);

  useEffect(() => {
    cargarIngresos();
  }, []);

  const cargarIngresos = async () => {
    try {
      const data = await getIngresos();
      const ingresosOrdenados = data.sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );
      setIngresos(ingresosOrdenados);
    } catch (error) {
      setError(error.message);
    }
  };

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    // Ajustar a zona horaria de Argentina
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

  const handleClickLapiz = (ingreso) => {
    setIngresoSeleccionado(ingreso);
  };

  if (error) {
    return <div className="error-mensaje">{error}</div>;
  }

  return (
    <div className="listado-ingresos-container">
      <h3 className="listado-titulo">Últimos Ingresos Registrados</h3>
      <div className="tabla-responsive">
        <table className="tabla-ingresos">
          <thead>
            <tr>
              <th>FECHA</th>
              <th>CATEGORÍA</th>
              <th>IMPORTE</th>
              <th>ACCIONES</th>
              <th>OBS</th>
            </tr>
          </thead>
          <tbody>
            {ingresos.map((ingreso) => (
              <tr
                key={ingreso._id}
                className={
                  ingreso._id === ultimoIngresoId ? "nuevo-ingreso" : ""
                }
              >
                <td>{formatearFecha(ingreso.fecha)}</td>
                <td>{ingreso.categoria.nombre}</td>
                <td className="importe">{formatearImporte(ingreso.importe)}</td>

                <td className="acciones">
                  <button
                    className="btn-accion"
                    onClick={() => handleClickLapiz(ingreso)}
                  >
                    <FaPencilAlt />
                  </button>
                </td>
                <td className="observaciones">
                  {ingreso.observaciones?.trim() ? (
                    <span
                      className="tiene-obs"
                      title={ingreso.observaciones}
                      onClick={() => handleClickLapiz(ingreso)}
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

      {ingresoSeleccionado && (
        <IngresosDatosAdicionales
          ingreso={ingresoSeleccionado}
          onClose={() => setIngresoSeleccionado(null)}
          onUpdate={cargarIngresos}
        />
      )}
    </div>
  );
};

ListadoIngresos.propTypes = {
  ultimoIngresoId: PropTypes.string,
};
