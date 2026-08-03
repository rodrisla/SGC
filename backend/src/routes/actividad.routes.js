import { Router } from "express";
import actividadController from "../controllers/actividad.controller.js";

const router = Router();

router.post("/", actividadController.crear);
router.get("/", actividadController.obtenerTodos);
router.get("/:id", actividadController.obtenerPorId);
router.put("/:id", actividadController.actualizar);
router.delete("/:id", actividadController.eliminar);

export default router;