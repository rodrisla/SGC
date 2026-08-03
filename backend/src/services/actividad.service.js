import mongoose from "mongoose";
import actividadRepository from "../repositories/actividad.repository.js";
import clienteRepository from "../repositories/cliente.repository.js";
import vendedorRepository from "../repositories/vendedor.repository.js";

class ActividadService {
  validarId(id, entidad = "actividad") {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error(`El ID de ${entidad} no es válido`);
      error.statusCode = 400;
      throw error;
    }
  }

  obtenerId(valor) {
    if (!valor) return null;

    return valor._id
      ? valor._id.toString()
      : valor.toString();
  }

  validarTipo(tipo) {
    const tipoNormalizado = tipo?.trim().toLowerCase();

    if (!["llamado", "visita"].includes(tipoNormalizado)) {
      const error = new Error(
        "El tipo de actividad debe ser llamado o visita"
      );
      error.statusCode = 400;
      throw error;
    }

    return tipoNormalizado;
  }

  validarFecha(fecha) {
    const fechaNormalizada = new Date(fecha);

    if (Number.isNaN(fechaNormalizada.getTime())) {
      const error = new Error(
        "La fecha de la actividad no es válida"
      );
      error.statusCode = 400;
      throw error;
    }

    if (fechaNormalizada > new Date()) {
      const error = new Error(
        "La fecha de la actividad no puede ser futura"
      );
      error.statusCode = 400;
      throw error;
    }

    return fechaNormalizada;
  }

  async validarRelacion(clienteId, vendedorId) {
    this.validarId(clienteId, "cliente");
    this.validarId(vendedorId, "vendedor");

    const [cliente, vendedor] = await Promise.all([
      clienteRepository.obtenerPorId(clienteId),
      vendedorRepository.obtenerPorId(vendedorId),
    ]);

    if (!cliente) {
      const error = new Error("Cliente no encontrado");
      error.statusCode = 404;
      throw error;
    }

    if (!vendedor) {
      const error = new Error("Vendedor no encontrado");
      error.statusCode = 404;
      throw error;
    }

    if (!cliente.activo) {
      const error = new Error(
        "No se pueden registrar actividades para un cliente inactivo"
      );
      error.statusCode = 409;
      throw error;
    }

    if (!vendedor.activo) {
      const error = new Error(
        "No se pueden registrar actividades para un vendedor inactivo"
      );
      error.statusCode = 409;
      throw error;
    }

    const vendedorDelCliente = this.obtenerId(cliente.vendedor);

    if (!vendedorDelCliente) {
      const error = new Error(
        "El cliente todavía no tiene un vendedor asignado"
      );
      error.statusCode = 409;
      throw error;
    }

    if (vendedorDelCliente !== vendedorId.toString()) {
      const error = new Error(
        "El cliente no está asignado al vendedor seleccionado"
      );
      error.statusCode = 409;
      throw error;
    }
  }

  async crear(datosActividad) {
    const cliente = this.obtenerId(datosActividad.cliente);
    const vendedor = this.obtenerId(datosActividad.vendedor);
    const tipo = this.validarTipo(datosActividad.tipo);

    await this.validarRelacion(cliente, vendedor);

    const datosNormalizados = {
      cliente,
      vendedor,
      tipo,
    };

    if (datosActividad.fecha !== undefined) {
      datosNormalizados.fecha = this.validarFecha(
        datosActividad.fecha
      );
    }

    return await actividadRepository.crear(datosNormalizados);
  }

  async obtenerTodos() {
    return await actividadRepository.obtenerTodos();
  }

  async obtenerPorId(id) {
    this.validarId(id);

    const actividad = await actividadRepository.obtenerPorId(id);

    if (!actividad) {
      const error = new Error("Actividad no encontrada");
      error.statusCode = 404;
      throw error;
    }

    return actividad;
  }

  async actualizar(id, datosActualizados) {
    this.validarId(id);

    const actividadActual =
      await actividadRepository.obtenerPorId(id);

    if (!actividadActual) {
      const error = new Error("Actividad no encontrada");
      error.statusCode = 404;
      throw error;
    }

    const cliente =
      datosActualizados.cliente !== undefined
        ? this.obtenerId(datosActualizados.cliente)
        : this.obtenerId(actividadActual.cliente);

    const vendedor =
      datosActualizados.vendedor !== undefined
        ? this.obtenerId(datosActualizados.vendedor)
        : this.obtenerId(actividadActual.vendedor);

    await this.validarRelacion(cliente, vendedor);

    const datosNormalizados = {};

    if (datosActualizados.cliente !== undefined) {
      datosNormalizados.cliente = cliente;
    }

    if (datosActualizados.vendedor !== undefined) {
      datosNormalizados.vendedor = vendedor;
    }

    if (datosActualizados.tipo !== undefined) {
      datosNormalizados.tipo = this.validarTipo(
        datosActualizados.tipo
      );
    }

    if (datosActualizados.fecha !== undefined) {
      datosNormalizados.fecha = this.validarFecha(
        datosActualizados.fecha
      );
    }

    return await actividadRepository.actualizar(
      id,
      datosNormalizados
    );
  }

  async eliminar(id) {
    this.validarId(id);

    const actividad = await actividadRepository.eliminar(id);

    if (!actividad) {
      const error = new Error("Actividad no encontrada");
      error.statusCode = 404;
      throw error;
    }

    return actividad;
  }
}

export default new ActividadService();