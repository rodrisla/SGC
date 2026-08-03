import { Router } from "express";
import estadisticaController from "../controllers/estadistica.controller.js";

const router = Router();

router.get(
  "/resumen",
  estadisticaController.obtenerResumen
);

export default router;