import Area from "../models/area.model.js";

class AreaRepository {
  async crear(datosArea) {
    return await Area.create(datosArea);
  }

  async obtenerTodas() {
    return await Area.find().sort({ nombre: 1 });
  }

  async obtenerPorId(id) {
    return await Area.findById(id);
  }

  async obtenerPorNombre(nombre) {
    return await Area.findOne({ nombre }).collation({
      locale: "es",
      strength: 2,
    });
  }

  async actualizar(id, datosActualizados) {
    return await Area.findByIdAndUpdate(id, datosActualizados, {
      new: true,
      runValidators: true,
    });
  }

  async desactivar(id) {
    return await Area.findByIdAndUpdate(
      id,
      { activa: false },
      {
        new: true,
        runValidators: true,
      }
    );
  }
}

export default new AreaRepository();