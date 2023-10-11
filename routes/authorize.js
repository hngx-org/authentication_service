const express = require("express");
const {
  getAuth,
  getAuthPermissions,
  sendPermissionsAndRows,
} = require("../controllers/authorize");
const router = express.Router();

router.post("/", getAuth);
router.post("/permissions", getAuthPermissions);
router.get("/roles-and-permissions", sendPermissionsAndRows);

module.exports = router;
