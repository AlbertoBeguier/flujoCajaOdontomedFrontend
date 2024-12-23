import PropTypes from "prop-types";
import { Line } from "react-chartjs-2";

export const GraficoEgresosDiarios = ({
  datos,
  opciones,
  diasSeleccionados,
  setDiasSeleccionados,
}) => {
  return (
    <div className="grafico-item">
      <div className="grafico-header">
        <h3>Gastos Diarios</h3>
        <select
          value={diasSeleccionados}
          onChange={(e) => setDiasSeleccionados(Number(e.target.value))}
          className="dias-selector"
        >
          {[7, 14, 21, 30].map((dias) => (
            <option key={dias} value={dias}>
              {dias} días
            </option>
          ))}
        </select>
      </div>
      <Line data={datos} options={opciones} id="grafico-egresos-diarios" />
    </div>
  );
};

GraficoEgresosDiarios.propTypes = {
  datos: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    datasets: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  opciones: PropTypes.object.isRequired,
  diasSeleccionados: PropTypes.number.isRequired,
  setDiasSeleccionados: PropTypes.func.isRequired,
};
