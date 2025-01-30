import { useState } from "react";
import logo from "../../../assets/odontomed512_512.png";
import logo1 from "../../../assets/odontomedBigLogo.png";
import { createEgreso } from "../../../services/egresosService";
import { FormularioEgreso } from "./FormularioEgreso";
import { ListadoEgresos } from "./ListadoEgresos";
import { SaldosSeleccionPanel } from "./SaldosSeleccionPanel";
import "./RegistroEgresos.scss";
import { actualizarSaldo } from "../../../services/saldosService";

export const RegistroEgresos = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [saldoSeleccionado, setSaldoSeleccionado] = useState(null);
  const [ultimoEgresoId, setUltimoEgresoId] = useState(null);
  const [actualizarSaldos, setActualizarSaldos] = useState(0);

  const handleSaldoSeleccionado = (saldo) => {
    setSaldoSeleccionado(saldo);
    setMostrarFormulario(true);
  };

  const handleGuardarEgreso = async (formData) => {
    let egresoCompleto;
    try {
      if (!saldoSeleccionado?.nombre) {
        throw new Error("No hay saldo seleccionado");
      }

      // Limpiar los _id de la ruta
      const rutaLimpia = saldoSeleccionado.rutaCategoria.map(
        ({ codigo, nombre }) => ({
          codigo,
          nombre,
        })
      );

      egresoCompleto = {
        fecha: formData.fecha,
        importe: Number(formData.importe),
        categoria: {
          codigo: saldoSeleccionado.categoriaId,
          nombre: saldoSeleccionado.nombre,
          rutaCategoria: rutaLimpia,
        },
        saldoAfectado: {
          nombre: saldoSeleccionado.nombre,
          rutaCategoria: rutaLimpia,
        },
        observaciones: "",
      };

      console.log("Datos a enviar:", JSON.stringify(egresoCompleto, null, 2));

      const nuevoEgreso = await createEgreso(egresoCompleto);

      if (nuevoEgreso) {
        await actualizarSaldo(
          saldoSeleccionado.categoriaId,
          saldoSeleccionado.saldo - formData.importe
        );

        setUltimoEgresoId(nuevoEgreso._id);
        setMostrarFormulario(false);
        setSaldoSeleccionado(null);
        setActualizarSaldos((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error detallado al guardar egreso:", {
        mensaje: error.message,
        saldoSeleccionado,
        datosEnviados: egresoCompleto,
      });
      throw error;
    }
  };

  const handleCancelarEgreso = () => {
    setMostrarFormulario(false);
    setSaldoSeleccionado(null);
  };

  if (mostrarFormulario) {
    return (
      <>
        <FormularioEgreso
          saldoAfectado={saldoSeleccionado}
          onGuardar={handleGuardarEgreso}
          onCancelar={handleCancelarEgreso}
        />
      </>
    );
  }

  return (
    <>
      <div className="pagina-egresos-container-2">
        <img src={logo} alt="Logo" className="egresos-logo" />
        <img src={logo1} alt="Logo1" className="egresos-logo-1" />
        <p className="egresos-registro-titulo">Registro de Egresos</p>
      </div>
      <SaldosSeleccionPanel
        onSaldoSeleccionado={handleSaldoSeleccionado}
        actualizarSaldos={actualizarSaldos}
      />
      <ListadoEgresos ultimoEgresoId={ultimoEgresoId} />
    </>
  );
};
