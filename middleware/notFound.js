const notFound = (req, res) => {
  // const error = new Error(`Not Found : ${req.originalUrl}`);
  res.status(404).json({ success: false, message: "Route not found" });
  // next(error);
};

module.exports = {
  notFound,
};
