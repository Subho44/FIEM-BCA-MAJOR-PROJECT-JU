const express = require('express');
const router = express.Router();
const actrl = require("../controller/authController");

router.post("/register",actrl.registeruser);
router.post("/verify-otp",actrl.verifyotp);
router.post("/login",actrl.loginuser);

module.exports = router;
