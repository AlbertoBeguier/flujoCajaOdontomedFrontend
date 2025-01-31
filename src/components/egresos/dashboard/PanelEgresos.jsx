import { useState, useEffect, useCallback, useMemo } from "react";
import { getEgresos } from "../../../services/egresosService";
import { TablaResumenEgresos } from "./TablaResumenEgresos";
import { ArbolJerarquicoEgresos } from "./ArbolJerarquicoEgresos";
import logo from "../../../assets/odontomed512_512.png";
import logo1 from "../../../assets/odontomedBigLogo.png";
import "./DashboardEgresos.scss";
import { SaldosPanelEgresos } from "./SaldosPanelEgresos";

export const PanelEgresos = () => {
  // Estados principales
  const [egresos, setEgresos] = useState([]);
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

  const filtrarEgresosPorPeriodo = useCallback(
    (data) => {
      return data.filter((egreso) => {
        const fecha = new Date(egreso.fecha);
        const fechaEgreso = new Date(
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
        return fechaEgreso >= fechaDesde && fechaEgreso <= fechaHasta;
      });
    },
    [filtros]
  );

  useEffect(() => {
    const cargarEgresos = async () => {
      try {
        const data = await getEgresos();
        const egresosFiltrados = filtrarEgresosPorPeriodo(data);
        setEgresos(egresosFiltrados);
      } catch (err) {
        setError(err.message);
      }
    };

    cargarEgresos();
  }, [filtrarEgresosPorPeriodo]);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  const obtenerCategorias = useCallback(() => {
    const categorias = new Set(["TODAS"]);
    egresos.forEach((egreso) => {
      egreso.categoria.rutaCategoria.forEach((cat) => {
        categorias.add(cat.nombre);
      });
    });
    return Array.from(categorias);
  }, [egresos]);

  const obtenerSubcategorias = useCallback(() => {
    const subcategorias = new Set(["TODAS"]);
    egresos.forEach((egreso) => {
      if (egreso.subcategoria?.rutaSubcategoria) {
        egreso.subcategoria.rutaSubcategoria.forEach((sub) => {
          subcategorias.add(sub.nombre);
        });
      }
    });
    return Array.from(subcategorias);
  }, [egresos]);

  const handleCategoriaChange = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setSubcategoriaSeleccionada("TODAS");
  };

  const handleSubcategoriaChange = (subcategoria) => {
    setSubcategoriaSeleccionada(subcategoria);
  };

  const egresosFiltrados = useMemo(() => {
    return egresos.filter((egreso) => {
      const cumpleCategoria =
        categoriaSeleccionada === "TODAS" ||
        egreso.categoria.rutaCategoria.some(
          (cat) => cat.nombre === categoriaSeleccionada
        );

      const cumpleSubcategoria =
        subcategoriaSeleccionada === "TODAS" ||
        egreso.subcategoria?.rutaSubcategoria?.some(
          (sub) => sub.nombre === subcategoriaSeleccionada
        );

      return cumpleCategoria && cumpleSubcategoria;
    });
  }, [egresos, categoriaSeleccionada, subcategoriaSeleccionada]);

  return (
    <>
      <div className="dashboard-egresos-container">
        {error && <div className="error-message">{error}</div>}
        <div className="pagina-egresos-container">
          <img src={logo} alt="Logo" className="egresos-logo" />
          <img src={logo1} alt="Logo1" className="egresos-logo-1" />
          <p className="egresos-titulo">Dashboard de Egresos</p>
        </div>

        <SaldosPanelEgresos />

        <div className="dashboard-egresos-filtros">
          <div className="dashboard-egresos-periodo">
            <span className="filtro-egresos-label">Desde:</span>
            <input
              type="number"
              min="1"
              max="31"
              value={filtros.diaDesde}
              onChange={(e) =>
                handleFiltroChange("diaDesde", parseInt(e.target.value))
              }
              className="input-dia-egresos"
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

            <span className="filtro-egresos-label">Hasta:</span>
            <input
              type="number"
              min="1"
              max="31"
              value={filtros.diaHasta}
              onChange={(e) =>
                handleFiltroChange("diaHasta", parseInt(e.target.value))
              }
              className="input-dia-egresos"
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

        <div className="dashboard-egresos-tabla-container">
          <div className="tabla-egresos-responsive">
            <TablaResumenEgresos egresos={egresos} filtros={filtros} />
            <div style={{ padding: "7px 0" }}>
              <ArbolJerarquicoEgresos
                datos={egresos}
                nodosExpandidos={nodosExpandidos}
                setNodosExpandidos={setNodosExpandidos}
              />
            </div>

            <div style={{ padding: "7px 0" }}>
              <div className="dashboard-egresos-periodo">
                <span className="filtro-egresos-label">Categoría</span>
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

                <span className="filtro-egresos-label">Subcategoría</span>
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
                <TablaResumenEgresos
                  egresos={egresosFiltrados}
                  filtros={filtros}
                  categoriaSeleccionada={categoriaSeleccionada}
                  subcategoriaSeleccionada={subcategoriaSeleccionada}
                  esFiltrado={true}
                />
                <div style={{ padding: "7px 0" }}>
                  <ArbolJerarquicoEgresos
                    datos={egresosFiltrados}
                    nodosExpandidos={nodosExpandidos}
                    setNodosExpandidos={setNodosExpandidos}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
