const { Router } = require("express");
const SwaggerController = require("../controllers/SwaggerController");
const authenticationRoute = require("./authenticationRoute");
const authorizationRoute = require("./authorizationRoute");

const router = Router();

router.use("/docs", SwaggerController.serve, SwaggerController.setup);
router.use("/auth", authenticationRoute);
router.use("/authorize", authorizationRoute);

module.exports = router;
