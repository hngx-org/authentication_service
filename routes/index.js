const { Router } = require("express");
const SwaggerController = require("../controllers/SwaggerController");
const authRoute = require("./authRoute");
const passwordRoute = require("./passwordRoute");

const router = Router();

router.use("/docs", SwaggerController.serve, SwaggerController.setup);
router.use("/auth", authRoute);
router.use("/password", passwordRoute);

module.exports = router;
