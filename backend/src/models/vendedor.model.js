import mongoose from "mongoose";

const vendedorSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre del vendedor es obligatorio"],
      trim: true,
    },

    apellido: {
      type: String,
      required: [true, "El apellido del vendedor es obligatorio"],
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
    },

    telefono: {
      type: String,
      trim: true,
    },

    area: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area",
      unique: true,
      sparse: true,
    },

    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Vendedor = mongoose.model("Vendedores", vendedorSchema);

export default Vendedor;