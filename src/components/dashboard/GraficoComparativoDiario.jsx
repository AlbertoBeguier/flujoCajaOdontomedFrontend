import PropTypes from "prop-types";
import { forwardRef } from "react";
import { Line } from "react-chartjs-2";

export const GraficoComparativoDiario = forwardRef(
  ({ datos, opciones, diasSeleccionados, setDiasSeleccionados }, ref) => {
    return (
      <div className="grafico-item">
        <div className="grafico-header">
          <h3>Ingresos vs Gastos Diarios</h3>
          <select
            value={diasSeleccionados}
            onChange={(e) => setDiasSeleccionados(Number(e.target.value))}
            className="periodo-selector"
          >
            <option value={7}>7 días</option>
            <option value={15}>15 días</option>
            <option value={30}>30 días</option>
          </select>
        </div>
        <Line data={datos} options={opciones} ref={ref} />
      </div>
    );
  }
);

GraficoComparativoDiario.displayName = "GraficoComparativoDiario";

GraficoComparativoDiario.propTypes = {
  datos: PropTypes.object.isRequired,
  opciones: PropTypes.object.isRequired,
  diasSeleccionados: PropTypes.number.isRequired,
  setDiasSeleccionados: PropTypes.func.isRequired,
};
