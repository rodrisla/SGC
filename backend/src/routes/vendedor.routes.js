import { Router } from "express";
import vendedorController from "../controllers/vendedor.controller.js";

const router = Router();

router.post("/", vendedorController.crear);
router.get("/", vendedorController.obtenerTodos);
router.get("/:id", vendedorController.obtenerPorId);
router.put("/:id", vendedorController.actualizar);
router.patch("/:id/desactivar", vendedorController.desactivar);

export default router;