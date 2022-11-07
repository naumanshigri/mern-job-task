const express = require("express");
const router = express.Router();

const controller = require("./controller");

router.route("/").get(controller.userList);

router.route("/login").post(controller.userLogin); // User login

router.route("/register").post(controller.signUp); // User login

module.exports = router;
