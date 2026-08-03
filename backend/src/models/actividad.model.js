import mongoose from "mongoose";

const actividadSchema = new mongoose.Schema(
  {
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cliente",
      required: [true, "El cliente es obligatorio"],
    },

    vendedor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendedor",
      required: [true, "El vendedor es obligatorio"],
    },

    tipo: {
      type: String,
      enum: {
        values: ["llamado", "visita"],
        message: "El tipo de actividad debe ser llamado o visita",
      },
      required: [true, "El tipo de actividad es obligatorio"],
    },

    fecha: {
      type: Date,
      required: [true, "La fecha de la actividad es obligatoria"],
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Ayudan a consultar y calcular estadísticas por fecha
actividadSchema.index({ vendedor: 1, fecha: -1 });
actividadSchema.index({ cliente: 1, fecha: -1 });
actividadSchema.index({ tipo: 1, fecha: -1 });

const Actividad = mongoose.model(
  "Actividad",
  actividadSchema,
  "actividades"
);

export default Actividad;