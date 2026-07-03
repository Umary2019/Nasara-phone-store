export function notFound(_req, res, next) {
  const error = new Error(`Not Found - ${_req.originalUrl}`);
  res.status(404);
  next(error);
}

export function errorHandler(err, _req, res, _next) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  // Log full error on the server so production logs contain the stack trace
  console.error(err && err.stack ? err.stack : err);

  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    // Do not expose stack trace to clients in production
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
}
