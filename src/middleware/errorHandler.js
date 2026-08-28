export const errorHandler = (err, req, res, _next) => {
  console.error(err);

  res.status(err.status || 500).json({
    error: err.name || 'InternalServerError',
    message: err.message || 'An unexpected error occurred',
  });
};
