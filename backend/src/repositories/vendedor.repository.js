import Vendedor from "../models/vendedor.model.js";

class VendedorRepository {
  async crear(datosVendedor) {
    return await Vendedor.create(datosVendedor);
  }

  async obtenerTodos() {
    return await Vendedor.find()
      .populate("area")
      .sort({ apellido: 1, nombre: 1 });
  }

  async obtenerPorId(id) {
    return await Vendedor.findById(id).populate("area");
  }

  async obtenerPorEmail(email) {
    return await Vendedor.findOne({ email });
  }

  async actualizar(id, datosActualizados) {
    return await Vendedor.findByIdAndUpdate(id, datosActualizados, {
      returnDocument: "after",
      runValidators: true,
    }).populate("area");
  }

  async desactivar(id) {
    return await Vendedor.findByIdAndUpdate(
      id,
      { activo: false },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );
  }
}

export default new VendedorRepository();