const { Router } = require("express");
const SwaggerController = require("../controllers/SwaggerController");
const authRoute = require("./authRoute");

const router = Router();

router.use("/docs", SwaggerController.serve, SwaggerController.setup);
router.use("/auth", authRoute);

module.exports = router;
