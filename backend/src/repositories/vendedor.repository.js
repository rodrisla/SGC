import Vendedor from "../models/vendedor.model.js";

class VendedorRepository {
  async crear(datosVendedor) {
    return await Vendedor.create(datosVendedor);
  }

  async obtenerTodos() {
    return await Vendedor.find()
      .populate("areas")
      .sort({ apellido: 1, nombre: 1 });
  }

  async obtenerPorId(id) {
    return await Vendedor.findById(id).populate("areas");
  }

  async obtenerPorEmail(email) {
    return await Vendedor.findOne({ email });
  }

  async actualizar(id, datosActualizados) {
    return await Vendedor.findByIdAndUpdate(id, datosActualizados, {
      new: true,
      runValidators: true,
    }).populate("area");
  }

  async desactivar(id) {
    return await Vendedor.findByIdAndUpdate(
      id,
      { activo: false },
      {
        new: true,
        runValidators: true,
      }
    );
  }
}

export default new VendedorRepository();