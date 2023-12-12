const errorHandler = (err, req, res, next) => {
  console.log(err);
  const parsedErr = JSON.parse(JSON.stringify(err)) || {};
  return res
    .status(parsedErr?.status || 400)
    .send({ hasError: true, message: parsedErr?.message || error?.message });
};

module.exports = errorHandler;
