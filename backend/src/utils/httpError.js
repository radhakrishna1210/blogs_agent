export function createHttpError(statusCode, message, code, details) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code || undefined;
  error.details = details || undefined;
  return error;
}
