export function notFound(_req, res) {
  return res.status(404).json({
    ok: false,
    status: 404,
    code: 'NOT_FOUND',
    error: 'Route not found',
  });
}
