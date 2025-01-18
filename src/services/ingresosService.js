import { API_BASE_URL } from "../config/constants";

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

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Error al crear el ingreso");
  }
};

export const getIngresos = async () => {
  try {
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

    return await response.json();
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

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Error al actualizar el ingreso");
  }
};
