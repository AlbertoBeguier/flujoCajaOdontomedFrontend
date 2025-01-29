import { API_BASE_URL } from "../config/constants";
import { createCache } from "./cacheService";

const ingresosCache = createCache();
const CACHE_KEY = "ingresos";

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
    ingresosCache.invalidate(); // Usamos el nuevo sistema
    return data;
  } catch (error) {
    throw new Error(error.message || "Error al crear el ingreso");
  }
};

export const getIngresos = async () => {
  const cachedData = ingresosCache.get(CACHE_KEY);
  if (cachedData) return cachedData;

  const response = await fetch(`${API_BASE_URL}/api/ingresos`, {
    headers: {
      Accept: "application/json",
      "Cache-Control": "no-cache",
      "If-None-Match": localStorage.getItem("ingresosEtag"),
    },
  });

  if (response.status === 304) {
    return ingresosCache.get(CACHE_KEY);
  }

  if (!response.ok) {
    throw new Error("Error al obtener los ingresos");
  }

  const etag = response.headers.get("ETag");
  if (etag) {
    localStorage.setItem("ingresosEtag", etag);
  }

  const data = await response.json();
  ingresosCache.set(CACHE_KEY, data);
  return data;
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
    ingresosCache.invalidate(); // Usamos el nuevo sistema
    return data;
  } catch (error) {
    throw new Error(error.message || "Error al actualizar el ingreso");
  }
};
