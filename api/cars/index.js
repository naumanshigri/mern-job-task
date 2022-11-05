const express = require("express");
const router = express.Router();

const controller = require("./controller");

router.post("/login", controller.userLogin); // User login

router.post("/register", controller.signUp); // User Register

module.exports = router;
