import PropTypes from "prop-types";
import { forwardRef } from "react";
import { Line } from "react-chartjs-2";

export const GraficoBalanceNeto = forwardRef(
  (
    { datos, opciones, periodoSeleccionado, setPeriodoSeleccionado, periodos },
    ref
  ) => {
    return (
      <div className="grafico-item">
        <div className="grafico-header">
          <h3>Balance Neto</h3>
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
        <Line data={datos} options={opciones} ref={ref} />
      </div>
    );
  }
);

GraficoBalanceNeto.propTypes = {
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

GraficoBalanceNeto.displayName = "GraficoBalanceNeto";
