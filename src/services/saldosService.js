import { API_BASE_URL } from "../config/constants";
import { createCache } from "./cacheService";

const saldosCache = createCache();

export const getSaldos = async () => {
  try {
    const cachedData = saldosCache.get();
    if (cachedData) return cachedData;

    const response = await fetch(`${API_BASE_URL}/api/saldos`);
    if (!response.ok) {
      throw new Error("Error al obtener saldos");
    }

    const data = await response.json();

    saldosCache.set(data);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const actualizarSaldo = async (categoriaId, nuevoSaldo) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/saldos/${categoriaId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        saldo: nuevoSaldo,
        codigo: categoriaId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.mensaje || "Error al actualizar saldo");
    }

    saldosCache.invalidate();

    return await response.json();
  } catch (error) {
    console.error("Error en actualizarSaldo:", error);
    throw error;
  }
};

export const inicializarSaldos = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/saldos/inicializar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.mensaje || "Error al inicializar saldos");
    }

    saldosCache.invalidate();
    return await response.json();
  } catch (error) {
    console.error("Error en inicializarSaldos:", error);
    throw error;
  }
};

export const getSaldosCalculados = async () => {
  try {
    const cachedData = saldosCache.get();
    if (cachedData) return cachedData;

    const response = await fetch(`${API_BASE_URL}/api/saldos/calculados`);
    if (!response.ok) {
      throw new Error("Error al obtener saldos calculados");
    }

    const data = await response.json();
    saldosCache.set(data);
    return data;
  } catch (error) {
    console.error("Error al obtener saldos:", error);
    throw error;
  }
};
