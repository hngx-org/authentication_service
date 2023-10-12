const notFound = (req, res) => {
  // const error = new Error(`Not Found : ${req.originalUrl}`);
  res.status(404).json({ status:"Error",code: "RESOURCE_NOT_FOUND", message: "Route not Found" });
  // next(error);
};

module.exports = {
  notFound,
};
