export function errorHandler(err, _req, res, _next) {
  const schemaMissing = err?.code === 'PGRST205';
  const statusCode = schemaMissing ? 503 : (err.statusCode || 500);

  res.status(statusCode).json({
    ok: false,
    status: statusCode,
    code: schemaMissing
      ? 'SUPABASE_SCHEMA_NOT_APPLIED'
      : (err.code || (statusCode === 404 ? 'NOT_FOUND' : statusCode >= 500 ? 'INTERNAL_SERVER_ERROR' : 'BAD_REQUEST')),
    error: schemaMissing
      ? 'Supabase tables are missing. Run supabase-schema.sql in the Supabase SQL editor first.'
      : (err.message || 'Internal server error'),
    ...(err.details ? { details: err.details } : {}),
  });
}
