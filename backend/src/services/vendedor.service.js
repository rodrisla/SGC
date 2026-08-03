import mongoose from "mongoose";
import vendedorRepository from "../repositories/vendedor.repository.js";

class VendedorService {
  validarId(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error("El ID del vendedor no es válido");
      error.statusCode = 400;
      throw error;
    }
  }

  async crear(datosVendedor) {
    if (datosVendedor.email) {
      datosVendedor.email = datosVendedor.email.trim().toLowerCase();

      const vendedorExistente =
        await vendedorRepository.obtenerPorEmail(datosVendedor.email);

      if (vendedorExistente) {
        const error = new Error("Ya existe un vendedor con ese email");
        error.statusCode = 409;
        throw error;
      }
    }

    return await vendedorRepository.crear(datosVendedor);
  }

  async obtenerTodos() {
    return await vendedorRepository.obtenerTodos();
  }

  async obtenerPorId(id) {
    this.validarId(id);

    const vendedor = await vendedorRepository.obtenerPorId(id);

    if (!vendedor) {
      const error = new Error("Vendedor no encontrado");
      error.statusCode = 404;
      throw error;
    }

    return vendedor;
  }

  async actualizar(id, datosActualizados) {
    this.validarId(id);

    if (datosActualizados.email) {
      datosActualizados.email = datosActualizados.email
        .trim()
        .toLowerCase();

      const vendedorConEseEmail =
        await vendedorRepository.obtenerPorEmail(datosActualizados.email);

      if (
        vendedorConEseEmail &&
        vendedorConEseEmail._id.toString() !== id
      ) {
        const error = new Error("Ya existe otro vendedor con ese email");
        error.statusCode = 409;
        throw error;
      }
    }

    const vendedorActualizado =
      await vendedorRepository.actualizar(id, datosActualizados);

    if (!vendedorActualizado) {
      const error = new Error("Vendedor no encontrado");
      error.statusCode = 404;
      throw error;
    }

    return vendedorActualizado;
  }

  async desactivar(id) {
    this.validarId(id);

    const vendedor = await vendedorRepository.desactivar(id);

    if (!vendedor) {
      const error = new Error("Vendedor no encontrado");
      error.statusCode = 404;
      throw error;
    }

    return vendedor;
  }
}

export default new VendedorService();