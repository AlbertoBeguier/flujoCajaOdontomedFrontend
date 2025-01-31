import PropTypes from "prop-types";
import { useCallback } from "react";
import "./DashboardEgresos.scss";

export const ArbolJerarquicoEgresos = ({
  datos,
  nodosExpandidos,
  setNodosExpandidos,
}) => {
  const formatearImporte = (importe) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(importe);
  };

  const calcularTotalesPorRuta = useCallback((data) => {
    const totales = {};

    data.forEach((egreso) => {
      // Procesar ruta completa de categoría
      let rutaActual = totales;
      egreso.categoria.rutaCategoria.forEach((cat) => {
        if (!rutaActual[cat.nombre]) {
          rutaActual[cat.nombre] = { total: 0, subCategorias: {} };
        }
        rutaActual[cat.nombre].total += egreso.importe;
        rutaActual = rutaActual[cat.nombre].subCategorias;
      });

      // Procesar ruta completa de subcategoría
      if (egreso.subcategoria?.rutaSubcategoria) {
        let rutaBase = totales;
        egreso.categoria.rutaCategoria.forEach((cat) => {
          if (!rutaBase[cat.nombre]) {
            rutaBase[cat.nombre] = { total: 0, subCategorias: {} };
          }
          rutaBase = rutaBase[cat.nombre].subCategorias;
        });

        egreso.subcategoria.rutaSubcategoria.forEach((sub) => {
          if (!rutaBase[sub.nombre]) {
            rutaBase[sub.nombre] = { total: 0, subCategorias: {} };
          }
          rutaBase[sub.nombre].total += egreso.importe;
          rutaBase = rutaBase[sub.nombre].subCategorias;
        });
      }
    });

    return totales;
  }, []);

  const toggleNodo = (ruta) => {
    setNodosExpandidos((prev) => {
      const nuevosNodos = new Set(prev);
      if (nuevosNodos.has(ruta)) {
        nuevosNodos.delete(ruta);
      } else {
        nuevosNodos.add(ruta);
      }
      return nuevosNodos;
    });
  };

  const RenderizarJerarquia = ({
    datos,
    nivel = 0,
    esUltimo = false,
    rutaPadre = "",
  }) => {
    const entries = Object.entries(datos);

    return entries.map(([nombre, info], index) => {
      const esUltimoItem = index === entries.length - 1;
      const tieneHijos = Object.keys(info.subCategorias).length > 0;
      const rutaActual = rutaPadre ? `${rutaPadre}-${nombre}` : nombre;
      const estaExpandido = nodosExpandidos.has(rutaActual);

      const getNivelColor = (nivel) => {
        const ciclo = nivel % 3;
        if (ciclo === 0) return "#8290e6";
        if (ciclo === 1) return "#6674d2";
        return "#4a57b3";
      };

      const getNivelFontWeight = (nivel) => {
        const ciclo = nivel % 3;
        if (ciclo === 0) return 400;
        if (ciclo === 1) return 500;
        return 600;
      };

      return (
        <div
          key={nombre}
          style={{ marginLeft: nivel > 0 ? `${nivel * 0.7}rem` : 0 }}
        >
          <div
            className={`categoria-egresos-nivel-${nivel}`}
            style={{
              color: getNivelColor(nivel),
              fontWeight: getNivelFontWeight(nivel),
              background: "transparent",
              borderRadius: "3px",
              padding: "0 2px",
              whiteSpace: "nowrap",
            }}
          >
            {tieneHijos && (
              <span
                className="btn-expandir-egresos"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNodo(rutaActual);
                }}
                style={{
                  display: "inline-block",
                  color: "inherit",
                  cursor: "pointer",
                  userSelect: "none",
                  padding: "0 4px",
                  fontFamily: '"Courier New", monospace',
                  opacity: 1,
                  transition: "opacity 0.2s ease",
                }}
                onMouseOver={(e) => (e.currentTarget.style.opacity = "0.8")}
                onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
              >
                {estaExpandido ? "└" : "├"}
              </span>
            )}
            <span
              className={`categoria-egresos-contenido ${
                esUltimo ? "ultimo" : ""
              }`}
              style={{
                display: "inline-block",
                padding: "0 1rem",
                marginRight: "0.1rem",
                whiteSpace: "nowrap",
                color: "inherit",
              }}
            >
              {nombre}: {formatearImporte(info.total)}
            </span>
          </div>
          {estaExpandido && tieneHijos && (
            <RenderizarJerarquia
              datos={info.subCategorias}
              nivel={nivel + 1}
              esUltimo={esUltimoItem}
              rutaPadre={rutaActual}
            />
          )}
        </div>
      );
    });
  };

  const totales = calcularTotalesPorRuta(datos);

  return (
    <div
      className="totales-egresos-desglose"
      style={{
        paddingLeft: "1.5rem",
        paddingTop: "0.2rem",
        fontFamily: '"Courier New", monospace',
        whiteSpace: "pre",
        fontSize: "0.95rem",
        lineHeight: 1.4,
        width: "100%",
        borderRadius: "8px",
        overflowX: "auto",
        backgroundColor: "transparent",
      }}
    >
      <RenderizarJerarquia datos={totales} />
    </div>
  );
};

ArbolJerarquicoEgresos.propTypes = {
  datos: PropTypes.arrayOf(
    PropTypes.shape({
      importe: PropTypes.number.isRequired,
      categoria: PropTypes.shape({
        rutaCategoria: PropTypes.arrayOf(
          PropTypes.shape({
            nombre: PropTypes.string.isRequired,
          })
        ).isRequired,
      }).isRequired,
      subcategoria: PropTypes.shape({
        rutaSubcategoria: PropTypes.arrayOf(
          PropTypes.shape({
            nombre: PropTypes.string.isRequired,
          })
        ),
      }),
    })
  ).isRequired,
  nodosExpandidos: PropTypes.instanceOf(Set).isRequired,
  setNodosExpandidos: PropTypes.func.isRequired,
};
