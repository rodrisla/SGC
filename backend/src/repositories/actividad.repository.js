import Actividad from "../models/actividad.model.js";

class ActividadRepository {
  async crear(datosActividad) {
    const actividad = await Actividad.create(datosActividad);

    return await Actividad.findById(actividad._id)
      .populate("cliente", "nombre cuit")
      .populate("vendedor", "nombre email");
  }

  async obtenerTodos() {
    return await Actividad.find()
      .populate("cliente", "nombre cuit")
      .populate("vendedor", "nombre email")
      .sort({ fecha: -1 });
  }

  async obtenerPorId(id) {
    return await Actividad.findById(id)
      .populate("cliente", "nombre cuit")
      .populate("vendedor", "nombre email");
  }

  async actualizar(id, datosActualizados) {
    return await Actividad.findByIdAndUpdate(
      id,
      datosActualizados,
      {
        returnDocument: "after",
        runValidators: true,
      }
    )
      .populate("cliente", "nombre cuit")
      .populate("vendedor", "nombre email");
  }

  async eliminar(id) {
    return await Actividad.findByIdAndDelete(id);
  }
}

export default new ActividadRepository();