const _ = require("lodash");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sendResponse, errReturned } = require("../../utils/dto");
const { SUCCESS, BADREQUEST, NOTFOUND } = require("../../utils/ResponseCodes");
const User = require("./models");
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.adminEmail,
    pass: process.env.adminpass,
  },
});

/**
 * 
 User Login
 */
exports.userLogin = async (req, res) => {
  try {
    let { email, password } = req.body;
    console.log("the request", req.body);
    // CHECKING IF THE USER IS EXIST
    const user = await User.findOne({ email });

    if (!user) return errReturned(res, "User Not Found ");
    // PASSWORD IS CORRECT
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return errReturned(res, "Invalid Password");
    let token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

    res.header("auth-token", token).json({ token, user });
  } catch (error) {
    console.log("the login error", error);
    return errReturned(res, error);
  }
};

/**
 * 
 Register User
 */
exports.signUp = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    console.log("React called req Body", req.body);
    let required = ["name", "email", "password"];

    for (let key of required) {
      if (
        !req["body"][key] ||
        req["body"][key] == "" ||
        req["body"][key] == undefined ||
        req["body"][key] == null
      )
        return sendResponse(res, BADREQUEST, `Please provide ${key}`);
    }

    // Check the User is already Exists in the database
    const emailExist = await User.findOne({ email: email });
    if (emailExist) return errReturned(res, "Email Already Exists");

    //Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //Create New User
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    const option = {
      from: "noreply@jobtask.com",
      to: user.email,
      subject: "Registration mail",
      text: "register successfully ",
    };

    let lastEmail = await transporter.sendMail(option, async (error, info) => {
      if (error) {
        return sendResponse(
          res,
          SUCCESS,
          "Register Faild",
          `Registration failed with email:- ${email}`
        );
      }
      return info;
    });
    const saveUser = await user.save();
    return sendResponse(
      res,
      SUCCESS,
      "Register Notification",
      `Email sent success fully to ${option.to}`
    );
  } catch (error) {
    return errReturned(res, error);
  }
};
