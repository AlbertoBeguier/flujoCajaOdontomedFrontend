import PropTypes from "prop-types";
import { NumericFormat } from "react-number-format";
import "./EntradaMonetaria.css";

export const EntradaMonetaria = ({
  valor,
  alCambiar,
  placeholder = "0,00",
}) => {
  return (
    <NumericFormat
      value={valor}
      onValueChange={(values) => {
        alCambiar(values.value);
      }}
      thousandSeparator="."
      decimalSeparator=","
      decimalScale={2}
      fixedDecimalScale
      allowNegative={false}
      placeholder={placeholder}
      className="entrada-monetaria"
    />
  );
};

EntradaMonetaria.propTypes = {
  valor: PropTypes.string.isRequired,
  alCambiar: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};
