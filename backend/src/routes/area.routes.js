import { Router } from "express";
import areaController from "../controllers/area.controller.js";

const router = Router();

router.post("/", areaController.crear);
router.get("/", areaController.obtenerTodas);
router.get("/:id", areaController.obtenerPorId);
router.put("/:id", areaController.actualizar);
router.patch("/:id/desactivar", areaController.desactivar);

export default router;