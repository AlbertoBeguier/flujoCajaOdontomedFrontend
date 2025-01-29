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

  const handleGuardarEgreso = async (egresoData) => {
    try {
      const egresoCompleto = {
        fecha: egresoData.fecha,
        importe: egresoData.importe,
        categoria: {
          codigo:
            saldoSeleccionado.rutaCategoria[
              saldoSeleccionado.rutaCategoria.length - 1
            ].codigo,
          nombre: saldoSeleccionado.nombre,
          rutaCategoria: saldoSeleccionado.rutaCategoria,
        },
        saldoAfectado: {
          nombre: saldoSeleccionado.nombre,
          rutaCategoria: saldoSeleccionado.rutaCategoria,
        },
        observaciones: egresoData.observaciones || "",
      };

      // Primero actualizamos el saldo
      await actualizarSaldo(
        saldoSeleccionado.categoriaId,
        saldoSeleccionado.saldo - egresoData.importe
      );

      // Luego creamos el egreso
      const nuevoEgreso = await createEgreso(egresoCompleto);

      setUltimoEgresoId(nuevoEgreso._id);
      setMostrarFormulario(false);
      setSaldoSeleccionado(null);
      setActualizarSaldos((prev) => prev + 1);

      return nuevoEgreso;
    } catch (error) {
      console.error("Error:", error);
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
