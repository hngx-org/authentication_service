const express = require("express");
const {
  authorize,
  getAuthPermissions,
  sendPermissionsAndRows,
} = require("../controllers/authorize");
const router = express.Router();

router.post("/", authorize);
router.post("/permissions", getAuthPermissions);
router.get("/roles-and-permissions", sendPermissionsAndRows);

module.exports = router;
