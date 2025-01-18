import { useState, useEffect } from "react";
import { getCategoriasEgresos } from "../services/categoriaEgresosService";

export const useCategoriasEgresos = () => {
  const [categorias, setCategorias] = useState([]);
  const [rutaSeleccion, setRutaSeleccion] = useState([]);
  const [categoriasVisibles, setCategoriasVisibles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerCategorias = async () => {
      try {
        const data = await getCategoriasEgresos();
        setCategorias(data);
        const categoriasPrincipales = data.filter((cat) => !cat.categoriaPadre);
        setCategoriasVisibles(categoriasPrincipales);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };
    obtenerCategorias();
  }, []);

  const esCategoriaNivelFinal = (categoria) => {
    return !categorias.some((cat) => cat.categoriaPadre === categoria.codigo);
  };

  const seleccionarCategoria = (categoriaSeleccionada) => {
    const nuevaRuta = [...rutaSeleccion, categoriaSeleccionada];
    setRutaSeleccion(nuevaRuta);

    const subcategorias = categorias.filter(
      (cat) => cat.categoriaPadre === categoriaSeleccionada.codigo
    );

    setCategoriasVisibles(subcategorias);
  };

  const volverAtras = () => {
    if (rutaSeleccion.length > 0) {
      const nuevaRuta = rutaSeleccion.slice(0, -1);
      setRutaSeleccion(nuevaRuta);

      if (nuevaRuta.length === 0) {
        const categoriasPrincipales = categorias.filter(
          (cat) => !cat.categoriaPadre
        );
        setCategoriasVisibles(categoriasPrincipales);
      } else {
        const categoriaAnterior = nuevaRuta[nuevaRuta.length - 1];
        const subcategorias = categorias.filter(
          (cat) => cat.categoriaPadre === categoriaAnterior.codigo
        );
        setCategoriasVisibles(subcategorias);
      }
    }
  };

  const resetearSeleccion = () => {
    setRutaSeleccion([]);
    const categoriasPrincipales = categorias.filter(
      (cat) => !cat.categoriaPadre
    );
    setCategoriasVisibles(categoriasPrincipales);
  };

  return {
    categorias,
    rutaSeleccion,
    categoriasVisibles,
    cargando,
    error,
    esCategoriaNivelFinal,
    seleccionarCategoria,
    volverAtras,
    resetearSeleccion,
  };
};
