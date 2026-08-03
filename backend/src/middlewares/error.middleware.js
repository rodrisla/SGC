export const notFound = (req, res) => {
  res.status(404).json({
    status: "error",
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler = (error, req, res, next) => {
  console.error(error);

  let statusCode = error.statusCode || 500;
  let message = error.message || "Error interno del servidor";

  if (error.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(error.errors)
      .map((validationError) => validationError.message)
      .join(", ");
  }

  if (error.code === 11000) {
    statusCode = 409;
    message = "Ya existe un registro con esos datos";
  }

  res.status(statusCode).json({
    status: "error",
    message,
  });
};