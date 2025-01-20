import { useState, useEffect, useCallback, useMemo } from "react";
import { getIngresos } from "../../../services/ingresosService";
import logo from "../../../assets/odontomed512_512.png";
import logo1 from "../../../assets/odontomedBigLogo.png";
import "./DashboardIngresos.scss";

export const DashboardIngresos = () => {
  const [ingresos, setIngresos] = useState([]);
  const [error, setError] = useState("");
  const [nodosExpandidos, setNodosExpandidos] = useState(new Set());
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("TODAS");
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] =
    useState("TODAS");

  // Estados para los filtros
  const [filtros, setFiltros] = useState(() => {
    const hoy = new Date();
    const ultimoDiaMes = new Date(
      hoy.getFullYear(),
      hoy.getMonth() + 1,
      0
    ).getDate();

    return {
      diaDesde: 1,
      mesDesde: hoy.getMonth(),
      anioDesde: hoy.getFullYear(),
      diaHasta: ultimoDiaMes,
      mesHasta: hoy.getMonth(),
      anioHasta: hoy.getFullYear(),
    };
  });

  const MESES = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const AÑOS = Array.from({ length: 11 }, (_, i) => 2024 + i);

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    const options = {
      timeZone: "America/Argentina/Buenos_Aires",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    return date.toLocaleDateString("es-AR", options);
  };

  const formatearImporte = (importe) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(importe);
  };

  const obtenerUltimoDiaMes = (mes, anio) => {
    return new Date(anio, mes + 1, 0).getDate();
  };

  const handleFiltroChange = (tipo, valor) => {
    setFiltros((prev) => {
      const nuevosFiltros = { ...prev, [tipo]: valor };

      // Si cambia el mes o año, actualizar el día según corresponda
      if (tipo === "mesDesde" || tipo === "anioDesde") {
        nuevosFiltros.diaDesde = 1;
      }
      if (tipo === "mesHasta" || tipo === "anioHasta") {
        nuevosFiltros.diaHasta = obtenerUltimoDiaMes(
          nuevosFiltros.mesHasta,
          nuevosFiltros.anioHasta
        );
      }

      return nuevosFiltros;
    });
  };

  const filtrarIngresosPorPeriodo = useCallback(
    (data) => {
      return data.filter((ingreso) => {
        const fecha = new Date(ingreso.fecha);
        const fechaIngreso = new Date(
          fecha.getFullYear(),
          fecha.getMonth(),
          fecha.getDate()
        );
        const fechaDesde = new Date(
          filtros.anioDesde,
          filtros.mesDesde,
          filtros.diaDesde
        );
        const fechaHasta = new Date(
          filtros.anioHasta,
          filtros.mesHasta,
          filtros.diaHasta
        );

        return fechaIngreso >= fechaDesde && fechaIngreso <= fechaHasta;
      });
    },
    [filtros]
  );

  const cargarIngresos = useCallback(async () => {
    try {
      const data = await getIngresos();
      const ingresosFiltrados = filtrarIngresosPorPeriodo(data);
      setIngresos(ingresosFiltrados);
    } catch (err) {
      setError(err.message);
    }
  }, [filtrarIngresosPorPeriodo]);

  useEffect(() => {
    cargarIngresos();
  }, [cargarIngresos]);

  const calcularTotal = useCallback(() => {
    return ingresos.reduce((total, ingreso) => total + ingreso.importe, 0);
  }, [ingresos]);

  const calcularTotalesPorRuta = useCallback((data) => {
    const totales = {};

    data.forEach((ingreso) => {
      // Procesar ruta completa de categoría
      let rutaActual = totales;
      ingreso.categoria.rutaCategoria.forEach((cat) => {
        if (!rutaActual[cat.nombre]) {
          rutaActual[cat.nombre] = { total: 0, subCategorias: {} };
        }
        rutaActual[cat.nombre].total += ingreso.importe;
        rutaActual = rutaActual[cat.nombre].subCategorias;
      });

      // Procesar ruta completa de subcategoría
      if (ingreso.subcategoria?.rutaSubcategoria) {
        let rutaBase = totales;
        // Primero asegurarse que existe toda la ruta de categoría
        ingreso.categoria.rutaCategoria.forEach((cat) => {
          if (!rutaBase[cat.nombre]) {
            rutaBase[cat.nombre] = { total: 0, subCategorias: {} };
          }
          rutaBase = rutaBase[cat.nombre].subCategorias;
        });

        // Luego procesar toda la ruta de subcategoría
        ingreso.subcategoria.rutaSubcategoria.forEach((sub) => {
          if (!rutaBase[sub.nombre]) {
            rutaBase[sub.nombre] = { total: 0, subCategorias: {} };
          }
          rutaBase[sub.nombre].total += ingreso.importe;
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

      return (
        <div key={nombre}>
          <div className={`categoria-nivel-${nivel}`}>
            {tieneHijos && (
              <span
                className="btn-expandir"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNodo(rutaActual);
                }}
              >
                {estaExpandido ? "└" : "├"}
              </span>
            )}
            <span className={`categoria-contenido ${esUltimo ? "ultimo" : ""}`}>
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

  const obtenerNombreMes = (numeroMes) => MESES[numeroMes];

  // Obtener solo el nivel actual de categorías
  const obtenerCategorias = useCallback(() => {
    const categorias = new Set();

    if (categoriaSeleccionada === "TODAS") {
      categorias.add("TODAS");
      // Solo mostrar primer nivel
      ingresos.forEach((ingreso) => {
        if (ingreso.categoria.rutaCategoria.length > 0) {
          categorias.add(ingreso.categoria.rutaCategoria[0].nombre);
        }
      });
    } else {
      // Agregar opción para volver atrás
      categorias.add("← Atrás");
      // Mantener selección actual
      categorias.add(categoriaSeleccionada);

      // Buscar subniveles de la categoría seleccionada
      ingresos.forEach((ingreso) => {
        const rutaActual = ingreso.categoria.rutaCategoria;
        const indexActual = rutaActual.findIndex(
          (cat) => cat.nombre === categoriaSeleccionada
        );

        if (indexActual !== -1 && rutaActual[indexActual + 1]) {
          categorias.add(rutaActual[indexActual + 1].nombre);
        }
      });
    }

    return Array.from(categorias);
  }, [ingresos, categoriaSeleccionada]);

  // Manejar la navegación en categorías
  const handleCategoriaChange = (valor) => {
    if (valor === "← Atrás") {
      // Encontrar categoría padre
      const encontrarPadre = () => {
        for (const ingreso of ingresos) {
          const ruta = ingreso.categoria.rutaCategoria;
          const index = ruta.findIndex(
            (cat) => cat.nombre === categoriaSeleccionada
          );
          if (index > 0) {
            return ruta[index - 1].nombre;
          }
        }
        return "TODAS";
      };
      setCategoriaSeleccionada(encontrarPadre());
    } else {
      setCategoriaSeleccionada(valor);
    }
  };

  // Obtener solo el nivel actual de subcategorías
  const obtenerSubcategorias = useCallback(() => {
    const subcategorias = new Set();

    if (subcategoriaSeleccionada === "TODAS") {
      subcategorias.add("TODAS");
      // Solo mostrar primer nivel
      ingresos
        .filter(
          (ingreso) =>
            categoriaSeleccionada === "TODAS" ||
            ingreso.categoria.rutaCategoria.some(
              (cat) => cat.nombre === categoriaSeleccionada
            )
        )
        .forEach((ingreso) => {
          if (ingreso.subcategoria?.rutaSubcategoria?.length > 0) {
            subcategorias.add(ingreso.subcategoria.rutaSubcategoria[0].nombre);
          }
        });
    } else {
      // Agregar opción para volver atrás
      subcategorias.add("← Atrás");
      // Mantener selección actual
      subcategorias.add(subcategoriaSeleccionada);

      // Mostrar siguiente nivel...
      ingresos
        .filter(
          (ingreso) =>
            categoriaSeleccionada === "TODAS" ||
            ingreso.categoria.rutaCategoria.some(
              (cat) => cat.nombre === categoriaSeleccionada
            )
        )
        .forEach((ingreso) => {
          const rutaActual = ingreso.subcategoria?.rutaSubcategoria || [];
          const indexActual = rutaActual.findIndex(
            (sub) => sub.nombre === subcategoriaSeleccionada
          );

          if (indexActual !== -1 && rutaActual[indexActual + 1]) {
            subcategorias.add(rutaActual[indexActual + 1].nombre);
          }
        });
    }

    return Array.from(subcategorias);
  }, [ingresos, categoriaSeleccionada, subcategoriaSeleccionada]);

  // Filtrar ingresos según categoría/subcategoría
  const ingresosFiltrados = useMemo(() => {
    return ingresos.filter((ingreso) => {
      const matchCategoria =
        categoriaSeleccionada === "TODAS" ||
        ingreso.categoria.rutaCategoria.some(
          (cat) => cat.nombre === categoriaSeleccionada
        );

      const matchSubcategoria =
        subcategoriaSeleccionada === "TODAS" ||
        ingreso.subcategoria?.rutaSubcategoria?.some(
          (sub) => sub.nombre === subcategoriaSeleccionada
        );

      return matchCategoria && matchSubcategoria;
    });
  }, [ingresos, categoriaSeleccionada, subcategoriaSeleccionada]);

  // Manejar la navegación en subcategorías (similar a categorías)
  const handleSubcategoriaChange = (valor) => {
    if (valor === "← Atrás") {
      // Encontrar subcategoría padre
      const encontrarPadre = () => {
        for (const ingreso of ingresos) {
          if (ingreso.subcategoria?.rutaSubcategoria) {
            const ruta = ingreso.subcategoria.rutaSubcategoria;
            const index = ruta.findIndex(
              (sub) => sub.nombre === subcategoriaSeleccionada
            );
            if (index > 0) {
              return ruta[index - 1].nombre;
            }
          }
        }
        return "TODAS";
      };
      setSubcategoriaSeleccionada(encontrarPadre());
    } else {
      setSubcategoriaSeleccionada(valor);
    }
  };

  // Renderizado del componente
  return (
    <>
      <div className="dashboard-container">
        {error && <div className="error-message">{error}</div>}

        {/* Header con logos */}
        <div className="pagina-ingresos-container">
          <img src={logo} alt="Logo" className="ingresos-logo" />
          <img src={logo1} alt="Logo1" className="ingresos-logo-1" />
          <p className="ingresos-titulo">Dashboard de Ingresos</p>
        </div>
      </div>

      <div className="dashboard-filtros">
        <div className="dashboard-periodo">
          <span className="filtro-label">desde</span>
          <input
            type="number"
            min="1"
            max={obtenerUltimoDiaMes(filtros.mesDesde, filtros.anioDesde)}
            value={filtros.diaDesde || 1}
            onChange={(e) => {
              const valor = parseInt(e.target.value);
              if (!isNaN(valor)) {
                handleFiltroChange("diaDesde", valor);
              }
            }}
            className="input-dia"
          />
          <select
            value={filtros.mesDesde}
            onChange={(e) =>
              handleFiltroChange("mesDesde", parseInt(e.target.value))
            }
          >
            {MESES.map((mes, index) => (
              <option key={index} value={index}>
                {mes}
              </option>
            ))}
          </select>
          <select
            value={filtros.anioDesde}
            onChange={(e) =>
              handleFiltroChange("anioDesde", parseInt(e.target.value))
            }
          >
            {AÑOS.map((anio) => (
              <option key={anio} value={anio}>
                {anio}
              </option>
            ))}
          </select>

          <span className="filtro-label">hasta</span>
          <input
            type="number"
            min="1"
            max={obtenerUltimoDiaMes(filtros.mesHasta, filtros.anioHasta)}
            value={filtros.diaHasta}
            onChange={(e) =>
              handleFiltroChange("diaHasta", parseInt(e.target.value))
            }
            className="input-dia"
          />
          <select
            value={filtros.mesHasta}
            onChange={(e) =>
              handleFiltroChange("mesHasta", parseInt(e.target.value))
            }
          >
            {MESES.map((mes, index) => (
              <option key={index} value={index}>
                {mes}
              </option>
            ))}
          </select>
          <select
            value={filtros.anioHasta}
            onChange={(e) =>
              handleFiltroChange("anioHasta", parseInt(e.target.value))
            }
          >
            {AÑOS.map((anio) => (
              <option key={anio} value={anio}>
                {anio}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="dashboard-tabla-container">
        <div className="tabla-responsive">
          <table className="dashboard-tabla">
            <thead>
              <tr>
                <th>FECHA</th>
                <th>CATEGORÍA</th>
                <th>SUBCATEGORÍA</th>
                <th>IMPORTE</th>
              </tr>
            </thead>
            <tbody>
              {ingresos.map((ingreso) => (
                <tr key={ingreso._id}>
                  <td>{formatearFecha(ingreso.fecha)}</td>
                  <td>
                    <div className="categoria-container">
                      <span className="categoria-cell">
                        {ingreso.categoria.nombre}
                      </span>
                      <div className="categoria-tooltip">
                        <div className="tooltip-content">
                          {ingreso.categoria.rutaCategoria
                            .map((cat) => cat.nombre)
                            .join(" → ")}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="categoria-container">
                      <span className="categoria-cell">
                        {ingreso.subcategoria?.nombre || "-"}
                      </span>
                      {ingreso.subcategoria?.rutaSubcategoria && (
                        <div className="categoria-tooltip">
                          <div className="tooltip-content">
                            {ingreso.subcategoria.rutaSubcategoria
                              .map((sub) => sub.nombre)
                              .join(" → ")}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="importe">
                    {formatearImporte(ingreso.importe)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="dashboard-total">
            <span className="periodo-total">
              Período: {filtros.diaDesde} de{" "}
              {obtenerNombreMes(filtros.mesDesde)} {filtros.anioDesde} -{" "}
              {filtros.diaHasta} de {obtenerNombreMes(filtros.mesHasta)}{" "}
              {filtros.anioHasta}
            </span>
            <div className="totales-desglose">
              <div className="total-general">
                Total General: {formatearImporte(calcularTotal())}
              </div>
              <RenderizarJerarquia datos={calcularTotalesPorRuta(ingresos)} />
            </div>
          </div>

          <div className="dashboard-periodo">
            <span className="filtro-label">Categoría</span>
            <select
              value={categoriaSeleccionada}
              onChange={(e) => handleCategoriaChange(e.target.value)}
            >
              {obtenerCategorias().map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <span className="filtro-label">Subcategoría</span>
            <select
              value={subcategoriaSeleccionada}
              onChange={(e) => handleSubcategoriaChange(e.target.value)}
            >
              {obtenerSubcategorias().map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {(categoriaSeleccionada !== "TODAS" ||
            subcategoriaSeleccionada !== "TODAS") && (
            <>
              <table className="dashboard-tabla">
                <thead>
                  <tr>
                    <th>FECHA</th>
                    <th>CATEGORÍA</th>
                    <th>SUBCATEGORÍA</th>
                    <th>IMPORTE</th>
                  </tr>
                </thead>
                <tbody>
                  {ingresosFiltrados.map((ingreso) => (
                    <tr key={ingreso._id}>
                      <td>{formatearFecha(ingreso.fecha)}</td>
                      <td>
                        <div className="categoria-container">
                          <span className="categoria-cell">
                            {ingreso.categoria.nombre}
                          </span>
                          <div className="categoria-tooltip">
                            <div className="tooltip-content">
                              {ingreso.categoria.rutaCategoria
                                .map((cat) => cat.nombre)
                                .join(" → ")}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="categoria-container">
                          <span className="categoria-cell">
                            {ingreso.subcategoria?.nombre || "-"}
                          </span>
                          {ingreso.subcategoria?.rutaSubcategoria && (
                            <div className="categoria-tooltip">
                              <div className="tooltip-content">
                                {ingreso.subcategoria.rutaSubcategoria
                                  .map((sub) => sub.nombre)
                                  .join(" → ")}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="importe">
                        {formatearImporte(ingreso.importe)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="dashboard-total">
                <span className="periodo-total">
                  Período: {filtros.diaDesde} de{" "}
                  {obtenerNombreMes(filtros.mesDesde)} {filtros.anioDesde} -{" "}
                  {filtros.diaHasta} de {obtenerNombreMes(filtros.mesHasta)}{" "}
                  {filtros.anioHasta}
                </span>
                <span className="periodo-total">
                  Categoría:{" "}
                  {categoriaSeleccionada === "TODAS"
                    ? "TODAS"
                    : ingresosFiltrados[0]?.categoria.rutaCategoria
                        .slice(
                          0,
                          ingresosFiltrados[0]?.categoria.rutaCategoria.findIndex(
                            (cat) => cat.nombre === categoriaSeleccionada
                          ) + 1
                        )
                        .map((cat) => cat.nombre)
                        .join(" → ")}
                  <br />
                  Subcategoría:{" "}
                  {subcategoriaSeleccionada === "TODAS"
                    ? "TODAS"
                    : ingresosFiltrados[0]?.subcategoria?.rutaSubcategoria
                        .slice(
                          0,
                          ingresosFiltrados[0]?.subcategoria.rutaSubcategoria.findIndex(
                            (sub) => sub.nombre === subcategoriaSeleccionada
                          ) + 1
                        )
                        .map((sub) => sub.nombre)
                        .join(" → ")}
                </span>
                <div className="totales-desglose">
                  <div className="total-general">
                    Total Filtrado:{" "}
                    {formatearImporte(
                      ingresosFiltrados.reduce(
                        (acc, ing) => acc + ing.importe,
                        0
                      )
                    )}
                  </div>
                  <RenderizarJerarquia
                    datos={calcularTotalesPorRuta(ingresosFiltrados)}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
