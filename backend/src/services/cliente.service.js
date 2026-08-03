import mongoose from "mongoose";
import clienteRepository from "../repositories/cliente.repository.js";
import vendedorRepository from "../repositories/vendedor.repository.js";
import areaRepository from "../repositories/area.repository.js";

class ClienteService {
  validarId(id, entidad = "cliente") {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error(`El ID de ${entidad} no es válido`);
      error.statusCode = 400;
      throw error;
    }
  }

  obtenerId(referencia) {
    if (!referencia) return null;

    return referencia._id
      ? referencia._id.toString()
      : referencia.toString();
  }

  normalizarCuit(cuit) {
    if (cuit === undefined || cuit === null || cuit === "") {
      return null;
    }

    const cuitNormalizado = String(cuit).replace(/\D/g, "");

    if (cuitNormalizado.length !== 11) {
      const error = new Error("El CUIT debe contener 11 números");
      error.statusCode = 400;
      throw error;
    }

    return cuitNormalizado;
  }

  async validarAsignacion({ vendedor, area, subzona }) {
    const asignacion = [vendedor, area, subzona];

    const sinAsignacion = asignacion.every(
      (valor) => valor === null || valor === undefined
    );

    if (sinAsignacion) {
      return;
    }

    const asignacionCompleta = asignacion.every(
      (valor) => valor !== null && valor !== undefined
    );

    if (!asignacionCompleta) {
      const error = new Error(
        "Para asignar un cliente debés indicar vendedor, área y subzona"
      );
      error.statusCode = 400;
      throw error;
    }

    this.validarId(vendedor, "vendedor");
    this.validarId(area, "área");

    if (!["primaria", "secundaria"].includes(subzona)) {
      const error = new Error(
        "La subzona debe ser primaria o secundaria"
      );
      error.statusCode = 400;
      throw error;
    }

    const [vendedorEncontrado, areaEncontrada] = await Promise.all([
      vendedorRepository.obtenerPorId(vendedor),
      areaRepository.obtenerPorId(area),
    ]);

    if (!vendedorEncontrado) {
      const error = new Error("Vendedor no encontrado");
      error.statusCode = 404;
      throw error;
    }

    if (!areaEncontrada) {
      const error = new Error("Área no encontrada");
      error.statusCode = 404;
      throw error;
    }

    if (!vendedorEncontrado.activo) {
      const error = new Error(
        "No se puede asignar un vendedor inactivo"
      );
      error.statusCode = 409;
      throw error;
    }

    if (!areaEncontrada.activa) {
      const error = new Error(
        "No se puede asignar un área inactiva"
      );
      error.statusCode = 409;
      throw error;
    }

    const areaDelVendedor = this.obtenerId(vendedorEncontrado.area);

    if (!areaDelVendedor) {
      const error = new Error(
        "El vendedor todavía no tiene un área asignada"
      );
      error.statusCode = 409;
      throw error;
    }

    if (areaDelVendedor !== area.toString()) {
      const error = new Error(
        "El área seleccionada no corresponde al vendedor"
      );
      error.statusCode = 409;
      throw error;
    }
  }

  async crear(datosCliente) {
    const nombre = datosCliente.nombre?.trim();

    if (!nombre) {
      const error = new Error("El nombre del cliente es obligatorio");
      error.statusCode = 400;
      throw error;
    }

    const datosNormalizados = {
      ...datosCliente,
      nombre,
    };

    const cuit = this.normalizarCuit(datosCliente.cuit);

    if (cuit) {
      const clienteExistente =
        await clienteRepository.obtenerPorCuit(cuit);

      if (clienteExistente) {
        const error = new Error("Ya existe un cliente con ese CUIT");
        error.statusCode = 409;
        throw error;
      }

      datosNormalizados.cuit = cuit;
    } else {
      delete datosNormalizados.cuit;
    }

    await this.validarAsignacion({
      vendedor: datosNormalizados.vendedor ?? null,
      area: datosNormalizados.area ?? null,
      subzona: datosNormalizados.subzona ?? null,
    });

    return await clienteRepository.crear(datosNormalizados);
  }

  async obtenerTodos() {
    return await clienteRepository.obtenerTodos();
  }

  async obtenerPorId(id) {
    this.validarId(id);

    const cliente = await clienteRepository.obtenerPorId(id);

    if (!cliente) {
      const error = new Error("Cliente no encontrado");
      error.statusCode = 404;
      throw error;
    }

    return cliente;
  }

  async actualizar(id, datosActualizados) {
    this.validarId(id);

    const clienteActual = await clienteRepository.obtenerPorId(id);

    if (!clienteActual) {
      const error = new Error("Cliente no encontrado");
      error.statusCode = 404;
      throw error;
    }

    const datosNormalizados = { ...datosActualizados };

    if (datosActualizados.nombre !== undefined) {
      const nombre = datosActualizados.nombre.trim();

      if (!nombre) {
        const error = new Error(
          "El nombre del cliente no puede estar vacío"
        );
        error.statusCode = 400;
        throw error;
      }

      datosNormalizados.nombre = nombre;
    }

    if (datosActualizados.cuit !== undefined) {
      const cuit = this.normalizarCuit(datosActualizados.cuit);

      if (!cuit) {
        const error = new Error("El CUIT no puede estar vacío");
        error.statusCode = 400;
        throw error;
      }

      const clienteConEseCuit =
        await clienteRepository.obtenerPorCuit(cuit);

      if (
        clienteConEseCuit &&
        clienteConEseCuit._id.toString() !== id
      ) {
        const error = new Error(
          "Ya existe otro cliente con ese CUIT"
        );
        error.statusCode = 409;
        throw error;
      }

      datosNormalizados.cuit = cuit;
    }

    const asignacionFinal = {
      vendedor:
        datosActualizados.vendedor !== undefined
          ? datosActualizados.vendedor
          : this.obtenerId(clienteActual.vendedor),

      area:
        datosActualizados.area !== undefined
          ? datosActualizados.area
          : this.obtenerId(clienteActual.area),

      subzona:
        datosActualizados.subzona !== undefined
          ? datosActualizados.subzona
          : clienteActual.subzona,
    };

    await this.validarAsignacion(asignacionFinal);

    const clienteActualizado = await clienteRepository.actualizar(
      id,
      datosNormalizados
    );

    if (!clienteActualizado) {
      const error = new Error("Cliente no encontrado");
      error.statusCode = 404;
      throw error;
    }

    return clienteActualizado;
  }

  async desactivar(id) {
    this.validarId(id);

    const cliente = await clienteRepository.desactivar(id);

    if (!cliente) {
      const error = new Error("Cliente no encontrado");
      error.statusCode = 404;
      throw error;
    }

    return cliente;
  }
}

export default new ClienteService();