export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  if (process.env.NODE_ENV !== "test") {
    // Basic logging
    // eslint-disable-next-line no-console
    console.error("[ERROR]", status, message);
  }
  res.status(status).json({ success: false, message });
};


