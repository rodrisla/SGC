import actividadService from "../services/actividad.service.js";

class ActividadController {
  async crear(req, res, next) {
    try {
      const actividad = await actividadService.crear(req.body);

      res.status(201).json({
        status: "success",
        message: "Actividad creada correctamente",
        data: actividad,
      });
    } catch (error) {
      next(error);
    }
  }

  async obtenerTodos(req, res, next) {
    try {
      const actividades = await actividadService.obtenerTodos();

      res.status(200).json({
        status: "success",
        results: actividades.length,
        data: actividades,
      });
    } catch (error) {
      next(error);
    }
  }

  async obtenerPorId(req, res, next) {
    try {
      const actividad = await actividadService.obtenerPorId(
        req.params.id
      );

      res.status(200).json({
        status: "success",
        data: actividad,
      });
    } catch (error) {
      next(error);
    }
  }

  async actualizar(req, res, next) {
    try {
      const actividad = await actividadService.actualizar(
        req.params.id,
        req.body
      );

      res.status(200).json({
        status: "success",
        message: "Actividad actualizada correctamente",
        data: actividad,
      });
    } catch (error) {
      next(error);
    }
  }

  async eliminar(req, res, next) {
    try {
      const actividad = await actividadService.eliminar(
        req.params.id
      );

      res.status(200).json({
        status: "success",
        message: "Actividad eliminada correctamente",
        data: actividad,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ActividadController();