import mongoose from "mongoose";
import Actividad from "../models/actividad.model.js";

class EstadisticaRepository {
  async obtenerResumen({ desde, hasta, vendedorId }) {
    const filtro = {
      fecha: {
        $gte: desde,
        $lt: hasta,
      },
    };

    if (vendedorId) {
      filtro.vendedor = new mongoose.Types.ObjectId(vendedorId);
    }

    const [resultado] = await Actividad.aggregate([
      {
        $match: filtro,
      },
      {
        $facet: {
          totales: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                llamados: {
                  $sum: {
                    $cond: [
                      { $eq: ["$tipo", "llamado"] },
                      1,
                      0,
                    ],
                  },
                },
                visitas: {
                  $sum: {
                    $cond: [
                      { $eq: ["$tipo", "visita"] },
                      1,
                      0,
                    ],
                  },
                },
              },
            },
            {
              $project: {
                _id: 0,
                total: 1,
                llamados: 1,
                visitas: 1,
              },
            },
          ],

          porVendedor: [
            {
              $group: {
                _id: "$vendedor",
                total: { $sum: 1 },
                llamados: {
                  $sum: {
                    $cond: [
                      { $eq: ["$tipo", "llamado"] },
                      1,
                      0,
                    ],
                  },
                },
                visitas: {
                  $sum: {
                    $cond: [
                      { $eq: ["$tipo", "visita"] },
                      1,
                      0,
                    ],
                  },
                },
              },
            },
            {
              $lookup: {
                from: "vendedores",
                localField: "_id",
                foreignField: "_id",
                as: "vendedor",
              },
            },
            {
              $unwind: {
                path: "$vendedor",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 0,
                vendedor: {
                  _id: "$_id",
                  nombre: {
                    $ifNull: [
                      "$vendedor.nombre",
                      "No disponible",
                    ],
                  },
                  apellido: {
                    $ifNull: ["$vendedor.apellido", ""],
                  },
                },
                total: 1,
                llamados: 1,
                visitas: 1,
              },
            },
            {
              $sort: {
                total: -1,
                "vendedor.apellido": 1,
              },
            },
          ],

          porDia: [
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$fecha",
                    timezone:
                      "America/Argentina/Buenos_Aires",
                  },
                },
                total: { $sum: 1 },
                llamados: {
                  $sum: {
                    $cond: [
                      { $eq: ["$tipo", "llamado"] },
                      1,
                      0,
                    ],
                  },
                },
                visitas: {
                  $sum: {
                    $cond: [
                      { $eq: ["$tipo", "visita"] },
                      1,
                      0,
                    ],
                  },
                },
              },
            },
            {
              $project: {
                _id: 0,
                fecha: "$_id",
                total: 1,
                llamados: 1,
                visitas: 1,
              },
            },
            {
              $sort: {
                fecha: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          totales: {
            $ifNull: [
              { $arrayElemAt: ["$totales", 0] },
              {
                total: 0,
                llamados: 0,
                visitas: 0,
              },
            ],
          },
          porVendedor: 1,
          porDia: 1,
        },
      },
    ]);

    return (
      resultado ?? {
        totales: {
          total: 0,
          llamados: 0,
          visitas: 0,
        },
        porVendedor: [],
        porDia: [],
      }
    );
  }
}

export default new EstadisticaRepository();