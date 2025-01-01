import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import {
  getListasMaestras,
  createListaMaestra,
} from "../../services/listaMaestraService";
import { ModalListaMaestra } from "./ModalListaMaestra";
import { ModalItems } from "./ModalItems";
import "./GestionListasMaestras.scss";

export const GestionListasMaestras = () => {
  const [listas, setListas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalItemsOpen, setModalItemsOpen] = useState(false);
  const [listaSeleccionada, setListaSeleccionada] = useState(null);
  const [listasExpandidas, setListasExpandidas] = useState(new Set());

  const cargarListas = async () => {
    try {
      const data = await getListasMaestras();
      setListas(data);
    } catch (error) {
      console.error("Error al cargar listas:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarListas();
  }, []);

  const handleCrearLista = async (formData) => {
    try {
      await createListaMaestra(formData);
      setModalOpen(false);
      cargarListas(); // Recargar las listas después de crear una nueva
    } catch (error) {
      console.error("Error al crear lista:", error);
      setError(error.message);
    }
  };

  const handleAgregarItems = (lista) => {
    setListaSeleccionada(lista);
    setModalItemsOpen(true);
  };

  const toggleItems = (listaId) => {
    const nuevasExpandidas = new Set(listasExpandidas);
    if (nuevasExpandidas.has(listaId)) {
      nuevasExpandidas.delete(listaId);
    } else {
      nuevasExpandidas.add(listaId);
    }
    setListasExpandidas(nuevasExpandidas);
  };

  const renderItems = (items) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="items-list">
        {items.map((item, index) => (
          <div key={index} className="item">
            <div className="item-nombre">{item.nombre}</div>
            {item.items && item.items.length > 0 && (
              <div className="subitems">{renderItems(item.items)}</div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Box className="listas-maestras-container">
      <h1>Gestión de Listas Maestras</h1>

      <button className="btn-nueva-lista" onClick={() => setModalOpen(true)}>
        AGREGAR NUEVA LISTA
      </button>

      {/* Mostrar listas existentes */}
      {isLoading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div className="listas-grid">
          {listas.map((lista) => (
            <div key={lista._id} className="lista-card">
              <h3>{lista.nombre}</h3>
              <p>{lista.descripcion}</p>
              <button
                className="btn-agregar-items"
                onClick={() => handleAgregarItems(lista)}
              >
                Agregar Items
              </button>
              <button
                className="btn-toggle-items"
                onClick={() => toggleItems(lista._id)}
              >
                {listasExpandidas.has(lista._id)
                  ? "Ocultar Items"
                  : "Ver Items"}
              </button>
              {listasExpandidas.has(lista._id) && renderItems(lista.items)}
            </div>
          ))}
        </div>
      )}

      <ModalListaMaestra
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCrearLista}
      />

      {listaSeleccionada && (
        <ModalItems
          isOpen={modalItemsOpen}
          onClose={() => {
            setModalItemsOpen(false);
            setListaSeleccionada(null);
          }}
          lista={listaSeleccionada}
          onItemsUpdated={cargarListas}
        />
      )}
    </Box>
  );
};
