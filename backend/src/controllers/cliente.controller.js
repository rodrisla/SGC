import clienteService from "../services/cliente.service.js";

class ClienteController {
  async crear(req, res, next) {
    try {
      const cliente = await clienteService.crear(req.body);

      res.status(201).json({
        status: "success",
        message: "Cliente creado correctamente",
        data: cliente,
      });
    } catch (error) {
      next(error);
    }
  }

  async obtenerTodos(req, res, next) {
    try {
      const clientes = await clienteService.obtenerTodos();

      res.status(200).json({
        status: "success",
        results: clientes.length,
        data: clientes,
      });
    } catch (error) {
      next(error);
    }
  }

  async obtenerPorId(req, res, next) {
    try {
      const cliente = await clienteService.obtenerPorId(req.params.id);

      res.status(200).json({
        status: "success",
        data: cliente,
      });
    } catch (error) {
      next(error);
    }
  }

  async actualizar(req, res, next) {
    try {
      const cliente = await clienteService.actualizar(
        req.params.id,
        req.body
      );

      res.status(200).json({
        status: "success",
        message: "Cliente actualizado correctamente",
        data: cliente,
      });
    } catch (error) {
      next(error);
    }
  }

  async desactivar(req, res, next) {
    try {
      const cliente = await clienteService.desactivar(req.params.id);

      res.status(200).json({
        status: "success",
        message: "Cliente desactivado correctamente",
        data: cliente,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ClienteController();