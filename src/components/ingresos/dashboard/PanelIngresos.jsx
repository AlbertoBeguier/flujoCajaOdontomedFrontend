import { useState, useEffect, useCallback, useMemo } from "react";
import { getIngresos } from "../../../services/ingresosService";
import { TablaResumen } from "./TablaResumen";
import { ArbolJerarquico } from "./ArbolJerarquico";
import logo from "../../../assets/odontomed512_512.png";
import logo1 from "../../../assets/odontomedBigLogo.png";
import "./DashboardIngresos.scss";
import { SaldosPanel } from "./SaldosPanel";

export const PanelIngresos = () => {
  // Estados principales
  const [ingresos, setIngresos] = useState([]);
  const [error, setError] = useState("");
  const [nodosExpandidos, setNodosExpandidos] = useState(new Set());
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("TODAS");
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] =
    useState("TODAS");

  // Estados para filtros de fecha
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

  const obtenerUltimoDiaMes = (mes, anio) => {
    return new Date(anio, mes + 1, 0).getDate();
  };

  const handleFiltroChange = (tipo, valor) => {
    setFiltros((prev) => {
      const nuevosFiltros = { ...prev, [tipo]: valor };
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

  // Obtener categorías y subcategorías para los selectores
  const obtenerCategorias = useCallback(() => {
    const categorias = new Set();
    if (categoriaSeleccionada === "TODAS") {
      categorias.add("TODAS");
      ingresos.forEach((ingreso) => {
        if (ingreso.categoria.rutaCategoria.length > 0) {
          categorias.add(ingreso.categoria.rutaCategoria[0].nombre);
        }
      });
    } else {
      categorias.add("← Atrás");
      categorias.add(categoriaSeleccionada);
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

  // Obtener subcategorías para el selector
  const obtenerSubcategorias = useCallback(() => {
    const subcategorias = new Set();
    if (subcategoriaSeleccionada === "TODAS") {
      subcategorias.add("TODAS");
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
      subcategorias.add("← Atrás");
      subcategorias.add(subcategoriaSeleccionada);
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

  // Manejar navegación en categorías
  const handleCategoriaChange = (valor) => {
    if (valor === "← Atrás") {
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

  // Manejar navegación en subcategorías
  const handleSubcategoriaChange = (valor) => {
    if (valor === "← Atrás") {
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

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  return (
    <>
      <div className="dashboard-container">
        {error && <div className="error-message">{error}</div>}
        <div className="pagina-ingresos-container">
          <img src={logo} alt="Logo" className="ingresos-logo" />
          <img src={logo1} alt="Logo1" className="ingresos-logo-1" />
          <p className="ingresos-titulo">Dashboard de Ingresos</p>
        </div>

        <SaldosPanel />
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
          <TablaResumen ingresos={ingresos} filtros={filtros} />
          <div style={{ padding: "7px 0" }}>
            <ArbolJerarquico
              datos={ingresos}
              nodosExpandidos={nodosExpandidos}
              setNodosExpandidos={setNodosExpandidos}
            />
          </div>

          <div style={{ padding: "7px 0" }}>
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
          </div>

          {(categoriaSeleccionada !== "TODAS" ||
            subcategoriaSeleccionada !== "TODAS") && (
            <>
              <TablaResumen
                ingresos={ingresosFiltrados}
                filtros={filtros}
                categoriaSeleccionada={categoriaSeleccionada}
                subcategoriaSeleccionada={subcategoriaSeleccionada}
                esFiltrado={true}
              />
              <div style={{ padding: "7px 0" }}>
                <ArbolJerarquico
                  datos={ingresosFiltrados}
                  nodosExpandidos={nodosExpandidos}
                  setNodosExpandidos={setNodosExpandidos}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
