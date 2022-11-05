const jwt = require("jsonwebtoken");
const User = require("../api/users/models");

const { UNAUTHORIZED } = require("./ResponseCodes");
const { sendResponse, errReturned } = require("./dto");

exports.authUser = async function (req, res, next) {
  const token = req.header("auth-token");
  console.log("Token is ", token);
  try {
    if (!token)
      return sendResponse(res, UNAUTHORIZED, { token: "Invalid Token" });
    const verified = await jwt.verify(
      token,
      process.env.TOKEN_SECRET,
      async (err, user) => {
        if (err) {
          return sendResponse(res, UNAUTHORIZED, "Expired", {
            message: "Token Expired please login again",
          });
        }
        return user;
      }
    );
    let userRole = await User.findOne({ _id: verified._id });
    if (!userRole.role.toString() === "user")
      return sendResponse(
        res,
        UNAUTHORIZED,
        "only auth user can access this route "
      );
    req.user = verified;

    next();
  } catch (error) {
    console.log("the token error :-", error);
    res.status(400).send({ token: "Invalid Token" });
  }
};

exports.authAdmin = async function (req, res, next) {
  const token = req.header("auth-token");
  try {
    if (!token)
      return sendResponse(res, UNAUTHORIZED, { token: "Invalid Token" });
    const verified = await jwt.verify(
      token,
      process.env.TOKEN_SECRET,
      async (err, user) => {
        if (err) {
          return sendResponse(res, UNAUTHORIZED, "Expired", {
            message: "Token Expired please login again",
          });
        }
        return user;
      }
    );
    let userRole = await User.findOne({ _id: verified._id });

    if (!userRole.role.toString() === "admin")
      return sendResponse(
        res,
        UNAUTHORIZED,
        "only admin can access this route"
      );
    req.user = verified;

    next();
  } catch (error) {
    res.status(400).send({ token: "Invalid Token" });
  }
};
