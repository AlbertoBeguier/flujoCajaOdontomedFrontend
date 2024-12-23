import PropTypes from "prop-types";
import { Line } from "react-chartjs-2";

export const GraficoComparativoDiario = ({
  datos,
  opciones,
  diasSeleccionados,
  setDiasSeleccionados,
}) => {
  const opcionesSelector = [
    { valor: 7, texto: "7 días" },
    { valor: 14, texto: "14 días" },
    { valor: 21, texto: "21 días" },
    { valor: 30, texto: "30 días" },
  ];

  return (
    <div className="grafico-item">
      <div className="grafico-header">
        <h3>Ingresos vs Gastos Diarios</h3>
        <select
          value={diasSeleccionados}
          onChange={(e) => setDiasSeleccionados(Number(e.target.value))}
          className="periodo-selector"
        >
          {opcionesSelector.map((opcion) => (
            <option key={opcion.valor} value={opcion.valor}>
              {opcion.texto}
            </option>
          ))}
        </select>
      </div>
      <Line data={datos} options={opciones} />
    </div>
  );
};

GraficoComparativoDiario.propTypes = {
  datos: PropTypes.object.isRequired,
  opciones: PropTypes.object.isRequired,
  diasSeleccionados: PropTypes.number.isRequired,
  setDiasSeleccionados: PropTypes.func.isRequired,
};
