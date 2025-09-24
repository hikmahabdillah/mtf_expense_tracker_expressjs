import validator from "validator";

export const requireFields = (fields) => (req, res, next) => {
  for (const field of fields) {
    if (!req.body || typeof req.body[field] === "undefined" || String(req.body[field]).trim() === "") {
      return res.status(400).json({ success: false, message: `${field} is required` });
    }
  }
  next();
};

export const sanitizeBody = (fields) => (req, res, next) => {
  if (!req.body) req.body = {};
  for (const field of fields) {
    if (typeof req.body[field] === "string") {
      req.body[field] = validator.escape(req.body[field].trim());
    }
  }
  next();
};

export const validatePositiveIntParam = (paramName) => (req, res, next) => {
  const id = Number(req.params[paramName]);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: `${paramName} must be a positive integer` });
  }
  next();
};


