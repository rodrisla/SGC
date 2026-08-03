import estadisticaService from "../services/estadistica.service.js";

class EstadisticaController {
  async obtenerResumen(req, res, next) {
    try {
      const resumen = await estadisticaService.obtenerResumen({
        periodo: req.query.periodo,
        fecha: req.query.fecha,
        vendedorId: req.query.vendedorId,
      });

      res.status(200).json({
        status: "success",
        data: resumen,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new EstadisticaController();