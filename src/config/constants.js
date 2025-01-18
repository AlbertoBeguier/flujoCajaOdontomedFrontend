export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://hammerhead-app-iuitt.ondigitalocean.app";

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
