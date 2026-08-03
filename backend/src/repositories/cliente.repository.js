import Cliente from "../models/cliente.model.js";

class ClienteRepository {
  async crear(datosCliente) {
    return await Cliente.create(datosCliente);
  }

  async obtenerTodos() {
    return await Cliente.find()
      .populate("vendedor", "nombre apellido email area activo")
      .populate("area", "nombre descripcion activa")
      .sort({ nombre: 1 });
  }

  async obtenerPorId(id) {
    return await Cliente.findById(id)
      .populate("vendedor", "nombre apellido email area activo")
      .populate("area", "nombre descripcion activa");
  }

  async obtenerPorCuit(cuit) {
    return await Cliente.findOne({ cuit });
  }

  async actualizar(id, datosActualizados) {
    return await Cliente.findByIdAndUpdate(id, datosActualizados, {
      returnDocument: "after",
      runValidators: true,
    })
      .populate("vendedor", "nombre apellido email area activo")
      .populate("area", "nombre descripcion activa");
  }

  async desactivar(id) {
    return await Cliente.findByIdAndUpdate(
      id,
      { activo: false },
      {
        returnDocument: "after",
        runValidators: true,
      }
    )
      .populate("vendedor", "nombre apellido email area activo")
      .populate("area", "nombre descripcion activa");
  }
}

export default new ClienteRepository();