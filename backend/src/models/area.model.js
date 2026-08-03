import mongoose from "mongoose";

const areaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre del área es obligatorio"],
      trim: true,
      unique: true,
    },

    descripcion: {
      type: String,
      trim: true,
      default: "",
    },

    activa: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Area = mongoose.model("Area", areaSchema);

export default Area;