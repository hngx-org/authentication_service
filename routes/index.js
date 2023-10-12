const { Router } = require("express");
const swaggerController = require("../controllers/SwaggerController");

const router = Router();

router.use("/docs", swaggerController.serve, swaggerController.setup);

module.exports = router;
