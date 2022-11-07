const _ = require("lodash");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sendResponse, errReturned } = require("../../utils/dto");
const { SUCCESS, BADREQUEST, NOTFOUND } = require("../../utils/ResponseCodes");
const User = require("./models");
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.adminEmail,
    pass: process.env.adminpass,
  },
});

// const transporter = nodemailer.createTransport({
//   host: "smtp.mailserver.com",
//   port: 2525,
//   auth: {
//     user: process.env.adminEmail,
//     pass: process.env.adminpass,
//   },
// });

// const transporter = nodemailer.createTransport({
//   host: "smtp.ethereal.email",
//   port: 587,
//   auth: {
//     user: "jarvis.windler@ethereal.email",
//     pass: "kBCmyCzuQpRXvue9Y4",
//   },
// });

/**
 * 
 User Login
 */
exports.userLogin = async (req, res) => {
  try {
    let { email, password } = req.body;
    // CHECKING IF THE USER IS EXIST
    const user = await User.findOne({ email });

    if (!user) return errReturned(res, "User Not Found ");
    // PASSWORD IS CORRECT
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return errReturned(res, "Invalid Password");
    let token = jwt.sign({ _id: user }, process.env.TOKEN_SECRET);

    res.header("auth-token", token).json({ token, user });
  } catch (error) {
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
    if (emailExist)
      return sendResponse(res, BADREQUEST, "Email Already Exists");

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
      from: "noreply@test.com",
      to: user.email,
      subject: "Registeration email",
      text: "Registration Success",
    };

    console.log("pro", process.env.adminEmail);
    console.log("pro", process.env.adminpass);

    // transporter.sendMail(option, async (error, info) => {
    //   console.log("error", error);
    //   if (error) {
    //     return sendResponse(
    //       res,
    //       BADREQUEST,
    //       "Register Faild",
    //       `Registration failed with email:- ${email}`
    //     );
    //   }

    //   await user.save();

    //   return sendResponse(
    //     res,
    //     SUCCESS,
    //     "Register Notification",
    //     `Email sent success fully to ${option.to}`
    //   );
    //   // return info;
    // });

    await user.save();

    return sendResponse(
      res,
      SUCCESS,
      "Register Notification",
      `Registration Success with this email: ${option.to}`
    );
  } catch (error) {
    return errReturned(res, error);
  }
};

exports.userList = async (req, res) => {
  try {
    let perPage = 5;
    let { pageNo } = req.query;
    let data = (pageNo - 1) * 5;

    let user = await User.find().skip(data).limit(perPage);
    let count = await User.count();

    if (user === undefined || user.length == 0)
      return sendResponse(res, SUCCESS, "Record not found");

    return sendResponse(res, SUCCESS, "user list", {
      count,
      data: user,
    });
  } catch (error) {
    return errReturned(res, error);
  }
};
