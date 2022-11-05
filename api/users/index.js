const express = require("express");
const router = express.Router();

const { registerLimiter, loginLimiter } = require("../../utils/rateLimiter");
// auth checker
const { authUser, authAdmin } = require("../../utils/verifyToken");

const controller = require("./controller");

router.post("/login", controller.userLogin); // User login

router.post("/register", controller.signUp); // User Register

module.exports = router;
