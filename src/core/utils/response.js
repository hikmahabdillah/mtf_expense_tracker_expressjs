export const ok = (res, { data = null, message = "OK", meta } = {}) => {
  const payload = { success: true, message };
  if (data !== undefined) payload.data = data;
  if (meta !== undefined) payload.meta = meta;
  return res.status(200).json(payload);
};

export const created = (res, { data = null, message = "Created", meta } = {}) => {
  const payload = { success: true, message };
  if (data !== undefined) payload.data = data;
  if (meta !== undefined) payload.meta = meta;
  return res.status(201).json(payload);
};

export const error = (res, { status = 500, message = "Internal Server Error", details } = {}) => {
  const payload = { success: false, message };
  if (details !== undefined) payload.details = details;
  return res.status(status).json(payload);
};


