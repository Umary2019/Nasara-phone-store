export function notFound(_req, res, next) {
  const error = new Error(`Not Found - ${_req.originalUrl}`);
  res.status(404);
  next(error);
}

export function errorHandler(err, _req, res, _next) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
}
