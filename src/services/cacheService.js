// Servicio centralizado de caché
export const createCache = (timeToLive = 5 * 60 * 1000) => {
  let cache = new Map();

  const isValid = (key) => {
    const item = cache.get(key);
    if (item && item.timestamp) {
      return Date.now() - item.timestamp < timeToLive;
    }
    return false;
  };

  const get = (key) => {
    if (isValid(key)) {
      return cache.get(key).data;
    }
    cache.delete(key); // Limpiar entradas expiradas
    return null;
  };

  const set = (key, data) => {
    cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  };

  const invalidate = (key) => {
    if (key) {
      cache.delete(key);
    } else {
      cache.clear();
    }
  };

  // Limpieza automática de caché
  setInterval(() => {
    for (const [key] of cache) {
      if (!isValid(key)) {
        cache.delete(key);
      }
    }
  }, timeToLive);

  return { get, set, invalidate };
};
