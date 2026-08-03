import { Router } from "express";
import clienteController from "../controllers/cliente.controller.js";

const router = Router();

router.post("/", clienteController.crear);
router.get("/", clienteController.obtenerTodos);
router.get("/:id", clienteController.obtenerPorId);
router.put("/:id", clienteController.actualizar);
router.patch("/:id/desactivar", clienteController.desactivar);

export default router;