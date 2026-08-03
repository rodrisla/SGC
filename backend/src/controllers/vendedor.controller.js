import vendedorService from "../services/vendedor.service.js";

class VendedorController {
  async crear(req, res, next) {
    try {
      const vendedor = await vendedorService.crear(req.body);

      res.status(201).json({
        status: "success",
        message: "Vendedor creado correctamente",
        data: vendedor,
      });
    } catch (error) {
      next(error);
    }
  }

  async obtenerTodos(req, res, next) {
    try {
      const vendedores = await vendedorService.obtenerTodos();

      res.status(200).json({
        status: "success",
        results: vendedores.length,
        data: vendedores,
      });
    } catch (error) {
      next(error);
    }
  }

  async obtenerPorId(req, res, next) {
    try {
      const vendedor = await vendedorService.obtenerPorId(req.params.id);

      res.status(200).json({
        status: "success",
        data: vendedor,
      });
    } catch (error) {
      next(error);
    }
  }

  async actualizar(req, res, next) {
    try {
      const vendedor = await vendedorService.actualizar(
        req.params.id,
        req.body
      );

      res.status(200).json({
        status: "success",
        message: "Vendedor actualizado correctamente",
        data: vendedor,
      });
    } catch (error) {
      next(error);
    }
  }

  async desactivar(req, res, next) {
    try {
      const vendedor = await vendedorService.desactivar(req.params.id);

      res.status(200).json({
        status: "success",
        message: "Vendedor desactivado correctamente",
        data: vendedor,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new VendedorController();