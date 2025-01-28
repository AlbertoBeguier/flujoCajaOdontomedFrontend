import { API_BASE_URL } from "../config/constants";

// Cache para almacenar las respuestas
let cache = {
  data: null,
  timestamp: null,
  timeToLive: 5 * 60 * 1000, // 5 minutos en milisegundos
};

export const createIngreso = async (ingresoData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ingresos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(ingresoData),
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || "Error al procesar la solicitud");
      } else {
        throw new Error("Error en la conexión con el servidor");
      }
    }

    const data = await response.json();
    clearCache(); // Limpiar caché después de crear
    return data;
  } catch (error) {
    throw new Error(error.message || "Error al crear el ingreso");
  }
};

export const getIngresos = async () => {
  try {
    // Verificar si hay datos en caché y si aún son válidos
    if (cache.data && cache.timestamp) {
      const ahora = Date.now();
      if (ahora - cache.timestamp < cache.timeToLive) {
        return cache.data; // Retorna datos del caché si son válidos
      }
    }

    // Si no hay caché válido, hacer la petición
    const response = await fetch(`${API_BASE_URL}/api/ingresos`);

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || "Error al obtener los ingresos");
      } else {
        throw new Error("Error en la conexión con el servidor");
      }
    }

    const data = await response.json();

    // Guardar en caché
    cache.data = data;
    cache.timestamp = Date.now();

    return data;
  } catch (error) {
    throw new Error(error.message || "Error al obtener los ingresos");
  }
};

export const updateIngreso = async (id, ingresoData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ingresos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(ingresoData),
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || "Error al actualizar el ingreso");
      } else {
        throw new Error("Error en la conexión con el servidor");
      }
    }

    const data = await response.json();
    clearCache(); // Limpiar caché después de actualizar
    return data;
  } catch (error) {
    throw new Error(error.message || "Error al actualizar el ingreso");
  }
};

// Función para limpiar el caché (útil después de crear/actualizar ingresos)
export const clearCache = () => {
  cache = {
    data: null,
    timestamp: null,
  };
};
