import mongoose from "mongoose";
import areaRepository from "../repositories/area.repository.js";

class AreaService {
  validarId(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error("El ID del área no es válido");
      error.statusCode = 400;
      throw error;
    }
  }

  async crear(datosArea) {
    const nombre = datosArea.nombre?.trim();

    if (!nombre) {
      const error = new Error("El nombre del área es obligatorio");
      error.statusCode = 400;
      throw error;
    }

    const areaExistente = await areaRepository.obtenerPorNombre(nombre);

    if (areaExistente) {
      const error = new Error("Ya existe un área con ese nombre");
      error.statusCode = 409;
      throw error;
    }

    return await areaRepository.crear({
      ...datosArea,
      nombre,
    });
  }

  async obtenerTodas() {
    return await areaRepository.obtenerTodas();
  }

  async obtenerPorId(id) {
    this.validarId(id);

    const area = await areaRepository.obtenerPorId(id);

    if (!area) {
      const error = new Error("Área no encontrada");
      error.statusCode = 404;
      throw error;
    }

    return area;
  }

  async actualizar(id, datosActualizados) {
    this.validarId(id);

    if (datosActualizados.nombre !== undefined) {
      const nombre = datosActualizados.nombre.trim();

      if (!nombre) {
        const error = new Error("El nombre del área no puede estar vacío");
        error.statusCode = 400;
        throw error;
      }

      const areaConEseNombre =
        await areaRepository.obtenerPorNombre(nombre);

      if (areaConEseNombre && areaConEseNombre._id.toString() !== id) {
        const error = new Error("Ya existe otra área con ese nombre");
        error.statusCode = 409;
        throw error;
      }

      datosActualizados.nombre = nombre;
    }

    const areaActualizada = await areaRepository.actualizar(
      id,
      datosActualizados
    );

    if (!areaActualizada) {
      const error = new Error("Área no encontrada");
      error.statusCode = 404;
      throw error;
    }

    return areaActualizada;
  }

  async desactivar(id) {
    this.validarId(id);

    const area = await areaRepository.desactivar(id);

    if (!area) {
      const error = new Error("Área no encontrada");
      error.statusCode = 404;
      throw error;
    }

    return area;
  }
}

export default new AreaService();