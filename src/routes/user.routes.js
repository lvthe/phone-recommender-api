const express = require("express");
const router = express.Router();

const { authRequired } = require("../middleware/auth.middleware");
const { onboarding } = require("../controllers/user.controller");

router.post("/onboarding", authRequired, onboarding);

module.exports = router;
