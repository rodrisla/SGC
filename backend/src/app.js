import express from "express";
import vendedorRoutes from "./routes/vendedor.routes.js";
import {  notFound,  errorHandler,} from "./middlewares/error.middleware.js";
import areaRoutes from "./routes/area.routes.js";
import clienteRoutes from "./routes/cliente.routes.js";
import actividadRoutes from "./routes/actividad.routes.js";
import estadisticaRoutes from "./routes/estadistica.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "SGC funcionando correctamente",
  });
});

app.use("/api/vendedores", vendedorRoutes);
app.use("/api/areas", areaRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/actividades", actividadRoutes);
app.use("/api/estadisticas", estadisticaRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;