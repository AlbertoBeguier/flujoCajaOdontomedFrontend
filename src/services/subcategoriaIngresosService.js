import { API_BASE_URL, ENDPOINTS } from "../config/constants";
import { getToken } from "./authService";

export const getSubcategoriasIngresos = async () => {
  const response = await fetch(
    `${API_BASE_URL}${ENDPOINTS.SUBCATEGORIAS_INGRESOS}`
  );

  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json();
      throw new Error(
        errorData.mensaje || "Error al obtener las subcategorías"
      );
    } else {
      throw new Error("Error en la conexión con el servidor");
    }
  }

  return response.json();
};

export const createSubcategoriaIngreso = async (datos) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/subcategorias-ingresos`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Error en la respuesta:", error);
      throw new Error(`Error ${response.status}: ${error}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al crear subcategoría:", error);
    throw error;
  }
};

export const agregarSubcategoria = async (
  categoriaPadreId,
  subcategoriaData
) => {
  const response = await fetch(
    `${API_BASE_URL}${ENDPOINTS.SUBCATEGORIAS_INGRESOS}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        ...subcategoriaData,
        categoriaPadre: categoriaPadreId,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.mensaje || "Error al agregar la subcategoría");
  }

  return response.json();
};

export const updateSubcategoriaIngreso = async (codigo, datos) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/subcategorias-ingresos/${codigo}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Error en la respuesta:", error);
      throw new Error(`Error ${response.status}: ${error}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al actualizar subcategoría:", error);
    throw error;
  }
};

export const convertirEnLista = async (subcategoriaData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.SUBCATEGORIAS_INGRESOS}/convertir-lista`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(subcategoriaData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.mensaje || "Error al convertir en lista");
    }

    const subcategoriaActualizada = await response.json();

    // Obtener todas las subcategorías
    const allSubcategorias = await getSubcategoriasIngresos();

    // Obtener el código base y el patrón de la lista
    const codigoBase = subcategoriaData.codigo.split(".")[0];
    const patronLista = subcategoriaData.codigo.substring(
      subcategoriaData.categoriaPadre.length
    );

    // Encontrar todos los profesionales que deberían tener esta lista
    const profesionales = allSubcategorias.filter(
      (sub) =>
        sub.codigo.split(".").length === 2 && // Es un profesional
        sub.codigo.startsWith(codigoBase + ".") && // Está bajo el mismo código base
        !allSubcategorias.some(
          (
            s // No tiene ya esta lista
          ) => s.categoriaPadre === sub.codigo && s.codigo.endsWith(patronLista)
        )
    );

    // Crear la lista para cada profesional que no la tenga
    for (const profesional of profesionales) {
      const nuevoCodigo = profesional.codigo + patronLista;
      await createSubcategoriaIngreso({
        nombre: subcategoriaData.nombre,
        codigo: nuevoCodigo,
        nivel: subcategoriaData.nivel,
        categoriaPadre: profesional.codigo,
        esLista: true,
      });
    }

    return subcategoriaActualizada;
  } catch (error) {
    console.error("Error detallado:", error);
    throw error;
  }
};

export const guardarItems = async (codigo, items) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/subcategorias-ingresos/${codigo}/items`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.mensaje || "Error al guardar items");
    }

    return response.json();
  } catch (error) {
    console.error("Error detallado:", error);
    throw error;
  }
};

export const actualizarItem = async (itemCodigo, nombre) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/subcategorias-ingresos/${itemCodigo}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.mensaje || "Error al actualizar item");
    }

    return response.json();
  } catch (error) {
    console.error("Error detallado:", error);
    throw error;
  }
};

const calcularNivel = (codigo) => {
  return codigo.split(".").length;
};

const obtenerCategoriaPadre = (codigo) => {
  const partes = codigo.split(".");
  return partes.slice(0, -1).join(".");
};

export const sincronizarTodasLasSubcategorias = async () => {
  try {
    const allSubcategorias = await getSubcategoriasIngresos();

    // Agrupar por el primer número del código
    const grupos = allSubcategorias
      .filter((sub) => sub.nivel === 2) // Solo profesionales
      .reduce((acc, sub) => {
        const grupoId = sub.codigo.split(".")[0];
        if (!acc[grupoId]) {
          acc[grupoId] = [];
        }
        acc[grupoId].push(obtenerMapaCompleto(sub, allSubcategorias));
        return acc;
      }, {});

    // Procesar cada grupo
    for (const [grupoId, profesionales] of Object.entries(grupos)) {
      console.log(`\n=== GRUPO ${grupoId} ===`);

      // Usar el profesional más completo como template
      const template = profesionales.reduce((masCompleto, actual) => {
        const contarSubcategorias = (obj) => {
          if (!obj.subcategorias) return 0;
          return Object.values(obj.subcategorias).reduce((total, sub) => {
            return total + 1 + contarSubcategorias(sub);
          }, 0);
        };

        const subcatMasCompleto = contarSubcategorias(masCompleto);
        const subcatActual = contarSubcategorias(actual);
        return subcatActual > subcatMasCompleto ? actual : masCompleto;
      });

      console.log(
        `\nUsando ${template.nombre} como template para Grupo ${grupoId}`
      );

      // Sincronizar cada profesional con el template
      for (const profesional of profesionales) {
        if (profesional.codigo !== template.codigo) {
          console.log(
            `\nComparando ${profesional.nombre} con template ${template.nombre}`
          );

          const diferencias = [];
          compararSubcategorias(
            template,
            profesional,
            template,
            profesional,
            diferencias
          );

          if (diferencias.length > 0) {
            console.log(`\n=== DIFERENCIAS EN GRUPO ${grupoId} ===`);
            await aplicarCorrecciones(profesional.nombre, diferencias);
          }
        }
      }
    }

    return true;
  } catch (error) {
    console.error("Error al sincronizar:", error);
    throw error;
  }
};

const compararSubcategorias = (
  subBase,
  subActual,
  mapaCompleto,
  mapaActual,
  diferencias
) => {
  // Procesar subcategorías anidadas
  Object.entries(subBase.subcategorias || {}).forEach(
    ([codAnidado, subAnidadaBase]) => {
      // Generar código equivalente usando el código del profesional actual
      const codigoEquivalente = codAnidado.replace(
        mapaCompleto.codigo,
        mapaActual.codigo
      );

      const subAnidadaActual = subActual.subcategorias?.[codigoEquivalente];

      if (!subAnidadaActual) {
        diferencias.push({
          tipo: "verificar_existencia",
          categoria: mapaActual.nombre,
          nombre: subAnidadaBase.nombre,
          codigo: codigoEquivalente,
          nivel: calcularNivel(codigoEquivalente),
          categoriaPadre: obtenerCategoriaPadre(codigoEquivalente),
          esLista: subAnidadaBase.esLista || false,
        });
      }

      // Recursivamente procesar subcategorías anidadas
      if (
        subAnidadaBase.subcategorias &&
        Object.keys(subAnidadaBase.subcategorias).length > 0
      ) {
        compararSubcategorias(
          subAnidadaBase,
          subAnidadaActual || { subcategorias: {} },
          mapaCompleto,
          mapaActual,
          diferencias
        );
      }
    }
  );
};

const obtenerMapaCompleto = (categoria, allSubcategorias) => {
  const mapa = {
    codigo: categoria.codigo,
    nombre: categoria.nombre,
    subcategorias: {},
  };

  // Función recursiva para obtener subcategorías
  const obtenerSubcategoriasRecursivas = (codigoPadre) => {
    const subcategorias = allSubcategorias.filter(
      (sub) => sub.categoriaPadre === codigoPadre
    );

    const mapaSubcategorias = {};

    subcategorias.forEach((sub) => {
      mapaSubcategorias[sub.codigo] = {
        nombre: sub.nombre,
        items: sub.lista?.items || [],
        subcategorias: obtenerSubcategoriasRecursivas(sub.codigo),
      };
    });

    return mapaSubcategorias;
  };

  // Obtener toda la estructura recursivamente
  mapa.subcategorias = obtenerSubcategoriasRecursivas(categoria.codigo);

  return mapa;
};

const aplicarCorrecciones = async (nombreCategoria, diferencias) => {
  console.log(`\nAplicando correcciones en ${nombreCategoria}:`);

  for (const dif of diferencias) {
    try {
      if (dif.tipo === "nombre_diferente") {
        console.log(
          `- Actualizando nombre: ${dif.nombreActual} -> ${dif.nombreEsperado}`
        );
        await updateSubcategoriaIngreso(dif.codigo, {
          nombre: dif.nombreEsperado,
        });
      } else if (dif.tipo === "verificar_existencia") {
        // Verificar si realmente no existe en la BD
        try {
          const existente = await getSubcategoriaIngreso(dif.codigo);
          if (existente) {
            console.log(
              `La subcategoría ${dif.codigo} ya existe, omitiendo creación`
            );
            continue;
          }
        } catch {
          // Si no existe, procedemos a crearla
          console.log(`- Creando subcategoría: ${dif.nombre}`);
          await createSubcategoriaIngreso({
            nombre: dif.nombre,
            codigo: dif.codigo,
            nivel: dif.nivel,
            categoriaPadre: dif.categoriaPadre,
            esLista: dif.esLista,
          });
        }
      }
    } catch (error) {
      console.error(`Error al aplicar corrección:`, error);
      console.error(`Datos de la diferencia:`, dif);
    }
  }
};

export const analizarEstructuraSubcategorias = async () => {
  try {
    const allSubcategorias = await getSubcategoriasIngresos();

    // 1. Agrupar categorías por su padre
    const categoriasPorPadre = allSubcategorias
      .filter((sub) => sub.nivel === 2)
      .reduce((grupos, categoria) => {
        const grupoPadre = categoria.codigo.split(".")[0];
        grupos[grupoPadre] = grupos[grupoPadre] || [];
        grupos[grupoPadre].push(categoria);
        return grupos;
      }, {});

    // 2. Procesar cada grupo por separado
    for (const [grupoPadre, categorias] of Object.entries(categoriasPorPadre)) {
      console.log(`\n=== GRUPO ${grupoPadre} ===`);

      // Mostrar estructura de cada categoría del grupo
      for (const categoria of categorias) {
        console.log(`\n=== ESTRUCTURA DE ${categoria.nombre} ===`);
        console.log(
          JSON.stringify(
            obtenerMapaCompleto(categoria, allSubcategorias),
            null,
            2
          )
        );
      }

      // Solo sincronizar si hay más de una categoría en el grupo
      if (categorias.length > 1) {
        // Encontrar la categoría más completa del grupo
        const categoriaCompleta = categorias.reduce((masCompleta, actual) => {
          const subcategoriasActual = allSubcategorias.filter((sub) =>
            sub.categoriaPadre.startsWith(actual.codigo)
          );

          const subcategoriasMasCompleta = masCompleta
            ? allSubcategorias.filter((sub) =>
                sub.categoriaPadre.startsWith(masCompleta.codigo)
              )
            : [];

          return subcategoriasActual.length > subcategoriasMasCompleta.length
            ? actual
            : masCompleta;
        }, categorias[0]);

        // Si ninguna categoría tiene subcategorías, no hay nada que sincronizar
        if (
          !allSubcategorias.some((sub) =>
            sub.categoriaPadre.startsWith(categoriaCompleta.codigo)
          )
        ) {
          console.log(`\nNo hay estructura definida en el grupo ${grupoPadre}`);
          continue;
        }

        const mapaCompleto = obtenerMapaCompleto(
          categoriaCompleta,
          allSubcategorias
        );

        // Sincronizar cada categoría del mismo grupo
        for (const categoria of categorias) {
          if (categoria.codigo === categoriaCompleta.codigo) continue;

          console.log(
            `\nComparando ${categoria.nombre} con ${categoriaCompleta.nombre} (Grupo ${grupoPadre})`
          );

          const mapaActual = obtenerMapaCompleto(categoria, allSubcategorias);
          const diferencias = [];

          // Comparar subcategorías solo dentro del mismo grupo
          Object.entries(mapaCompleto.subcategorias).forEach(
            ([codigo, subBase]) => {
              const codigoEquivalente = codigo.replace(
                categoriaCompleta.codigo,
                categoria.codigo
              );

              const subActual = mapaActual.subcategorias[codigoEquivalente];

              if (!subActual) {
                diferencias.push({
                  tipo: "falta_subcategoria",
                  categoria: categoria.nombre,
                  nombre: subBase.nombre,
                  codigo: codigoEquivalente,
                  nivel: subBase.nivel,
                  categoriaPadre: categoria.codigo,
                  esLista: subBase.esLista,
                });
              } else {
                compararSubcategorias(
                  subBase,
                  subActual,
                  mapaCompleto,
                  mapaActual,
                  diferencias
                );
              }
            }
          );

          // Mostrar y aplicar diferencias solo dentro del grupo actual
          if (diferencias.length > 0) {
            console.log(`\n=== DIFERENCIAS EN GRUPO ${grupoPadre} ===`);
            diferencias.forEach((dif) => {
              switch (dif.tipo) {
                case "nombre_diferente":
                  console.log(
                    `En ${dif.categoria} (${dif.codigo}): debería ser "${dif.nombreEsperado}" pero es "${dif.nombreActual}"`
                  );
                  break;
                case "falta_subcategoria":
                  console.log(
                    `En ${dif.categoria}${
                      dif.categoriaPadre ? ` > ${dif.categoriaPadre}` : ""
                    } falta: ${dif.nombre} (${dif.codigo})`
                  );
                  break;
              }
            });

            console.log(`\nAplicando correcciones en ${categoria.nombre}:`);
            for (const dif of diferencias) {
              try {
                if (dif.tipo === "nombre_diferente") {
                  console.log(
                    `- Actualizando nombre: ${dif.nombreActual} -> ${dif.nombreEsperado}`
                  );
                  await updateSubcategoriaIngreso(dif.codigo, {
                    nombre: dif.nombreEsperado,
                  });
                } else if (dif.tipo === "falta_subcategoria") {
                  console.log(`- Creando subcategoría: ${dif.nombre}`);
                  const codigoNuevo = obtenerCodigoEquivalente(
                    dif.codigo,
                    categoria.codigo
                  );
                  await createSubcategoriaIngreso({
                    nombre: dif.nombre,
                    codigo: codigoNuevo,
                    nivel: calcularNivel(codigoNuevo),
                    categoriaPadre: obtenerCategoriaPadre(codigoNuevo),
                    esLista: dif.esLista,
                  });
                }
              } catch (error) {
                console.error(`Error al aplicar corrección:`, error);
                console.error(`Datos de la diferencia:`, dif);
              }
            }
          }
        }
      }
    }

    return true;
  } catch (error) {
    console.error("Error al sincronizar:", error);
    throw error;
  }
};
