import { useState, useEffect, useCallback } from "react";
import { getSubcategoriasEgresos } from "../services/subcategoriaEgresosService";

export const useSubcategoriasEgresos = () => {
  const [subcategorias, setSubcategorias] = useState([]);
  const [rutaSeleccion, setRutaSeleccion] = useState([]);
  const [subcategoriasVisibles, setSubcategoriasVisibles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarEstadoGuardado = useCallback(
    (subcategoriaGuardada) => {
      if (subcategoriaGuardada?.rutaSubcategoria) {
        const padres = subcategoriaGuardada.rutaSubcategoria.slice(0, -1);
        setRutaSeleccion(padres);

        if (padres.length > 0) {
          const ultimoPadre = padres[padres.length - 1];
          const hijos = subcategorias.filter(
            (sub) => sub.categoriaPadre === ultimoPadre.codigo
          );
          setSubcategoriasVisibles(hijos);
        } else {
          const principales = subcategorias.filter(
            (sub) => !sub.categoriaPadre
          );
          setSubcategoriasVisibles(principales);
        }
      }
    },
    [subcategorias]
  );

  useEffect(() => {
    const obtenerSubcategorias = async () => {
      try {
        const data = await getSubcategoriasEgresos();
        setSubcategorias(data);
        if (rutaSeleccion.length === 0) {
          const subcategoriasPrincipales = data.filter(
            (subcat) => !subcat.categoriaPadre
          );
          setSubcategoriasVisibles(subcategoriasPrincipales);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };
    obtenerSubcategorias();
  }, [rutaSeleccion.length]);

  const seleccionarSubcategoria = (subcategoriaSeleccionada) => {
    const nuevaRuta = [...rutaSeleccion, subcategoriaSeleccionada];
    setRutaSeleccion(nuevaRuta);

    const subsubcategorias = subcategorias.filter(
      (subcat) => subcat.categoriaPadre === subcategoriaSeleccionada.codigo
    );
    setSubcategoriasVisibles(subsubcategorias);
  };

  const volverAtras = () => {
    if (rutaSeleccion.length > 0) {
      const nuevaRuta = rutaSeleccion.slice(0, -1);
      setRutaSeleccion(nuevaRuta);

      if (nuevaRuta.length === 0) {
        const subcategoriasPrincipales = subcategorias.filter(
          (subcat) => !subcat.categoriaPadre
        );
        setSubcategoriasVisibles(subcategoriasPrincipales);
      } else {
        const subcategoriaAnterior = nuevaRuta[nuevaRuta.length - 1];
        const subsubcategorias = subcategorias.filter(
          (subcat) => subcat.categoriaPadre === subcategoriaAnterior.codigo
        );
        setSubcategoriasVisibles(subsubcategorias);
      }
    }
  };

  const resetearSeleccion = () => {
    setRutaSeleccion([]);
    const subcategoriasPrincipales = subcategorias.filter(
      (subcat) => !subcat.categoriaPadre
    );
    setSubcategoriasVisibles(subcategoriasPrincipales);
  };

  return {
    subcategorias,
    rutaSeleccion,
    subcategoriasVisibles,
    cargando,
    error,
    seleccionarSubcategoria,
    volverAtras,
    resetearSeleccion,
    cargarEstadoGuardado,
  };
};
