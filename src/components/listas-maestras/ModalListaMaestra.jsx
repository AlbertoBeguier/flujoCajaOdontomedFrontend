import PropTypes from "prop-types";
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import "./ModalListaMaestra.scss";

export const ModalListaMaestra = ({
  isOpen,
  onClose,
  onSubmit,
  lista = null,
}) => {
  const [formData, setFormData] = useState({
    nombre: lista?.nombre || "",
    descripcion: lista?.descripcion || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {lista ? "Editar Lista Maestra" : "Nueva Lista Maestra"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre de la Lista"
            type="text"
            fullWidth
            value={formData.nombre}
            onChange={(e) =>
              setFormData({ ...formData, nombre: e.target.value })
            }
            required
          />
          <TextField
            margin="dense"
            label="Descripción"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={formData.descripcion}
            onChange={(e) =>
              setFormData({ ...formData, descripcion: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">
            {lista ? "Guardar Cambios" : "Crear Lista"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

ModalListaMaestra.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  lista: PropTypes.shape({
    nombre: PropTypes.string,
    descripcion: PropTypes.string,
  }),
};
