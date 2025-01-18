import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";

export const GraficoMediosPago = ({
  datos,
  opciones,
  periodoMediosPago,
  setPeriodoMediosPago,
  periodos,
}) => {
  return (
    <div className="grafico-item">
      <div className="grafico-header">
        <h3>Por Medio de Pago</h3>
        <select
          value={periodoMediosPago}
          onChange={(e) => setPeriodoMediosPago(e.target.value)}
          className="periodo-selector"
        >
          {periodos.map((periodo) => (
            <option key={periodo.valor} value={periodo.valor}>
              {periodo.texto}
            </option>
          ))}
        </select>
      </div>
      <Bar data={datos} options={opciones} id="grafico-medios-pago" />
    </div>
  );
};

GraficoMediosPago.propTypes = {
  datos: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    datasets: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  opciones: PropTypes.object.isRequired,
  periodoMediosPago: PropTypes.string.isRequired,
  setPeriodoMediosPago: PropTypes.func.isRequired,
  periodos: PropTypes.arrayOf(
    PropTypes.shape({
      valor: PropTypes.string.isRequired,
      texto: PropTypes.string.isRequired,
    })
  ).isRequired,
};
