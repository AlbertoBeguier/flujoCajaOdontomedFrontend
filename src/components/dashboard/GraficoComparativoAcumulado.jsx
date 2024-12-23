import PropTypes from "prop-types";
import { Line } from "react-chartjs-2";

export const GraficoComparativoAcumulado = ({
  datos,
  opciones,
  periodoSeleccionado,
  setPeriodoSeleccionado,
  periodos,
}) => {
  return (
    <div className="grafico-item">
      <div className="grafico-header">
        <h3>Acumulados Comparativos</h3>
        <select
          value={periodoSeleccionado}
          onChange={(e) => setPeriodoSeleccionado(e.target.value)}
          className="periodo-selector"
        >
          {periodos.map((periodo) => (
            <option key={periodo.valor} value={periodo.valor}>
              {periodo.texto}
            </option>
          ))}
        </select>
      </div>
      <Line data={datos} options={opciones} />
    </div>
  );
};

GraficoComparativoAcumulado.propTypes = {
  datos: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    datasets: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  opciones: PropTypes.object.isRequired,
  periodoSeleccionado: PropTypes.string.isRequired,
  setPeriodoSeleccionado: PropTypes.func.isRequired,
  periodos: PropTypes.arrayOf(
    PropTypes.shape({
      valor: PropTypes.string.isRequired,
      texto: PropTypes.string.isRequired,
    })
  ).isRequired,
};
