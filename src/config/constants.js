export const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.flujo-caja-odontomed.estudiobeguier.com"
    : "http://localhost:8080";

// Configuración de fetch
export const API_CONFIG = {
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
};

export const INITIAL_FORM_STATE = {
  codigo: "",
  nombre: "",
  nivel: 1,
  categoriaPadre: "",
};

export const INITIAL_SUBCATEGORIA_FORM_STATE = {
  codigo: "",
  nombre: "",
  nivel: 1,
  categoriaPadre: "",
  categoriaBase: "",
};

export const ENDPOINTS = {
  CATEGORIAS_EGRESOS: "/api/categorias-egresos",
  SUBCATEGORIAS_EGRESOS: "/api/subcategorias-egresos",
  SUBCATEGORIAS_INGRESOS: "/api/subcategorias-ingresos",
  CONVERTIR_LISTA: "/api/subcategorias-ingresos/convertir-lista",
};
