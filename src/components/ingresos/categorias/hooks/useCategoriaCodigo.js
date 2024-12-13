import { useState, useEffect } from "react";

export const useCategoriaCodigo = (categorias, categoriaPadre) => {
  const [siguienteCodigo, setSiguienteCodigo] = useState("");

  useEffect(() => {
    if (categoriaPadre) {
      const categoriaPadreObj = categorias.find(
        (c) => c.codigo === categoriaPadre
      );
      if (categoriaPadreObj) {
        const subcategorias = categorias.filter(
          (c) => c.categoriaPadre === categoriaPadre
        );
        const ultimoNumero =
          subcategorias.length > 0
            ? Math.max(
                ...subcategorias.map((c) => parseInt(c.codigo.split(".").pop()))
              )
            : 0;
        setSiguienteCodigo(`${categoriaPadreObj.codigo}.${ultimoNumero + 1}`);
      }
    } else {
      const categoriasNivel1 = categorias.filter((c) => !c.categoriaPadre);
      const ultimoNumero =
        categoriasNivel1.length > 0
          ? Math.max(...categoriasNivel1.map((c) => parseInt(c.codigo)))
          : 0;
      setSiguienteCodigo(`${ultimoNumero + 1}`);
    }
  }, [categorias, categoriaPadre]);

  return siguienteCodigo;
};
