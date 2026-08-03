import areaService from "../services/area.service.js";

class AreaController {
  async crear(req, res, next) {
    try {
      const area = await areaService.crear(req.body);

      res.status(201).json({
        status: "success",
        message: "Área creada correctamente",
        data: area,
      });
    } catch (error) {
      next(error);
    }
  }

  async obtenerTodas(req, res, next) {
    try {
      const areas = await areaService.obtenerTodas();

      res.status(200).json({
        status: "success",
        results: areas.length,
        data: areas,
      });
    } catch (error) {
      next(error);
    }
  }

  async obtenerPorId(req, res, next) {
    try {
      const area = await areaService.obtenerPorId(req.params.id);

      res.status(200).json({
        status: "success",
        data: area,
      });
    } catch (error) {
      next(error);
    }
  }

  async actualizar(req, res, next) {
    try {
      const area = await areaService.actualizar(req.params.id, req.body);

      res.status(200).json({
        status: "success",
        message: "Área actualizada correctamente",
        data: area,
      });
    } catch (error) {
      next(error);
    }
  }

  async desactivar(req, res, next) {
    try {
      const area = await areaService.desactivar(req.params.id);

      res.status(200).json({
        status: "success",
        message: "Área desactivada correctamente",
        data: area,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AreaController();