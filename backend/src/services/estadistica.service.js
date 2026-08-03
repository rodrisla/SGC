import mongoose from "mongoose";
import estadisticaRepository from "../repositories/estadistica.repository.js";
import vendedorRepository from "../repositories/vendedor.repository.js";

class EstadisticaService {
  validarPeriodo(periodo) {
    const periodoNormalizado = periodo?.trim().toLowerCase();

    if (!["semana", "mes"].includes(periodoNormalizado)) {
      const error = new Error(
        "El período debe ser semana o mes"
      );
      error.statusCode = 400;
      throw error;
    }

    return periodoNormalizado;
  }

  validarFecha(fecha) {
    if (!fecha) {
      const ahora = new Date();

      return {
        anio: ahora.getUTCFullYear(),
        mes: ahora.getUTCMonth(),
        dia: ahora.getUTCDate(),
      };
    }

    const formatoFecha = /^\d{4}-\d{2}-\d{2}$/;

    if (!formatoFecha.test(fecha)) {
      const error = new Error(
        "La fecha debe tener el formato YYYY-MM-DD"
      );
      error.statusCode = 400;
      throw error;
    }

    const [anio, mes, dia] = fecha
      .split("-")
      .map(Number);

    const fechaValidada = new Date(
      Date.UTC(anio, mes - 1, dia)
    );

    const fechaEsValida =
      fechaValidada.getUTCFullYear() === anio &&
      fechaValidada.getUTCMonth() === mes - 1 &&
      fechaValidada.getUTCDate() === dia;

    if (!fechaEsValida) {
      const error = new Error(
        "La fecha indicada no es válida"
      );
      error.statusCode = 400;
      throw error;
    }

    return {
      anio,
      mes: mes - 1,
      dia,
    };
  }

  calcularRangoSemanal({ anio, mes, dia }) {
    const fechaReferencia = new Date(
      Date.UTC(anio, mes, dia)
    );

    const diaSemana = fechaReferencia.getUTCDay();

    // En JavaScript: domingo = 0 y lunes = 1
    const diasDesdeElLunes =
      diaSemana === 0 ? 6 : diaSemana - 1;

    const inicioSemana = new Date(
      Date.UTC(anio, mes, dia - diasDesdeElLunes, 3)
    );

    const finSemana = new Date(inicioSemana);

    finSemana.setUTCDate(
      finSemana.getUTCDate() + 7
    );

    return {
      desde: inicioSemana,
      hasta: finSemana,
    };
  }

  calcularRangoMensual({ anio, mes }) {
    const inicioMes = new Date(
      Date.UTC(anio, mes, 1, 3)
    );

    const finMes = new Date(
      Date.UTC(anio, mes + 1, 1, 3)
    );

    return {
      desde: inicioMes,
      hasta: finMes,
    };
  }

  async validarVendedor(vendedorId) {
    if (!vendedorId) {
      return null;
    }

    if (!mongoose.Types.ObjectId.isValid(vendedorId)) {
      const error = new Error(
        "El ID del vendedor no es válido"
      );
      error.statusCode = 400;
      throw error;
    }

    const vendedor =
      await vendedorRepository.obtenerPorId(vendedorId);

    if (!vendedor) {
      const error = new Error(
        "Vendedor no encontrado"
      );
      error.statusCode = 404;
      throw error;
    }

    return vendedorId;
  }

  async obtenerResumen({
    periodo = "semana",
    fecha,
    vendedorId,
  }) {
    const periodoNormalizado =
      this.validarPeriodo(periodo);

    const fechaNormalizada =
      this.validarFecha(fecha);

    const vendedorValidado =
      await this.validarVendedor(vendedorId);

    const rango =
      periodoNormalizado === "semana"
        ? this.calcularRangoSemanal(fechaNormalizada)
        : this.calcularRangoMensual(fechaNormalizada);

    const resumen =
      await estadisticaRepository.obtenerResumen({
        desde: rango.desde,
        hasta: rango.hasta,
        vendedorId: vendedorValidado,
      });

    return {
      periodo: periodoNormalizado,
      rango: {
        desde: rango.desde,
        hasta: new Date(
          rango.hasta.getTime() - 1
        ),
      },
      filtro: {
        vendedorId: vendedorValidado,
      },
      ...resumen,
    };
  }
}

export default new EstadisticaService();