import axios from "axios";
import { API_BASE_URL } from "../config/constants";

const API_URL = `${API_BASE_URL}/listas-maestras`;

export const getListasMaestras = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getListaMaestra = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createListaMaestra = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const addItemToLista = async (listaId, itemData) => {
  const response = await axios.post(`${API_URL}/${listaId}/items`, itemData);
  return response.data;
};
