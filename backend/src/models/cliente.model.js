import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, "El nombre del cliente es obligatorio"],
            trim: true,
        },

        cuit: {
            type: String,
            trim: true,
            unique: true,
            sparse: true,
        },

        contacto: {
            type: String,
            trim: true,
            default: "",
        },

        cargoContacto: {
            type: String,
            trim: true,
            default: "",
        },

        telefonos: [
            {
                type: String,
                trim: true,
            },
        ],

        mails: [
            {
                type: String,
                trim: true,
                lowercase: true,
            },
        ],

        direccion: {
            type: String,
            trim: true,
            default: "",
        },

        localidad: {
            type: String,
            trim: true,
            default: "",
        },

        provincia: {
            type: String,
            trim: true,
            default: "",
        },

        codigoPostal: {
            type: String,
            trim: true,
            default: "",
        },

        latitud: {
            type: Number,
            min: -90,
            max: 90,
            default: null,
        },

        longitud: {
            type: Number,
            min: -180,
            max: 180,
            default: null,
        },

        vendedor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vendedores",
            default: null,
        },

        area: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Area",
            default: null,
        },

        subzona: {
            type: String,
            enum: {
                values: ["primaria", "secundaria"],
                message: "La subzona debe ser primaria o secundaria",
            },
            default: null,
        },

        productosInteres: [
            {
                type: String,
                trim: true,
            },
        ],

        productosComprados: [
            {
                type: String,
                trim: true,
            },
        ],

        estado: {
            type: String,
            enum: ["prospecto", "cliente"],
            default: "prospecto",
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

const Cliente = mongoose.model("Cliente", clienteSchema);

export default Cliente;