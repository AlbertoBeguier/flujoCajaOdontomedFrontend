import PropTypes from "prop-types";
import { Line } from "react-chartjs-2";

export const GraficoComparativoDiario = ({
  datos,
  opciones,
  diasSeleccionados,
  setDiasSeleccionados,
}) => {
  return (
    <div className="grafico-item">
      <div className="grafico-header">
        <h3>Ingresos vs Gastos Diarios</h3>
        <select
          value={diasSeleccionados}
          onChange={(e) => setDiasSeleccionados(Number(e.target.value))}
          className="dias-selector"
        >
          {[7, 15, 30, 60, 90].map((dias) => (
            <option key={dias} value={dias}>
              {dias} días
            </option>
          ))}
        </select>
      </div>
      <Line data={datos} options={opciones} />
    </div>
  );
};

GraficoComparativoDiario.propTypes = {
  datos: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    datasets: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  opciones: PropTypes.object.isRequired,
  diasSeleccionados: PropTypes.number.isRequired,
  setDiasSeleccionados: PropTypes.func.isRequired,
};
