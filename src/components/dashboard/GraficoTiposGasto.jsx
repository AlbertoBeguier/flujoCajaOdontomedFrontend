import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";

export const GraficoTiposGasto = ({
  datos,
  opciones,
  periodoTiposGasto,
  setPeriodoTiposGasto,
  periodos,
}) => {
  return (
    <div className="grafico-item">
      <div className="grafico-header">
        <h3>Por Tipo de Gasto</h3>
        <select
          value={periodoTiposGasto}
          onChange={(e) => setPeriodoTiposGasto(e.target.value)}
          className="periodo-selector"
        >
          {periodos.map((periodo) => (
            <option key={periodo.valor} value={periodo.valor}>
              {periodo.texto}
            </option>
          ))}
        </select>
      </div>
      <Bar data={datos} options={opciones} id="grafico-tipos-gasto" />
    </div>
  );
};

GraficoTiposGasto.propTypes = {
  datos: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    datasets: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  opciones: PropTypes.object.isRequired,
  periodoTiposGasto: PropTypes.string.isRequired,
  setPeriodoTiposGasto: PropTypes.func.isRequired,
  periodos: PropTypes.arrayOf(
    PropTypes.shape({
      valor: PropTypes.string.isRequired,
      texto: PropTypes.string.isRequired,
    })
  ).isRequired,
};
