const express = require("express");
const router = express.Router();

const controller = require("./controller");
// auth checker
const { authUser, authAdmin } = require("../../utils/verifyToken");

router
  .route("/")
  .get(controller.getCarList)
  .post(authUser, controller.createCarRecords);

router
  .route("/categories")
  .get(controller.getCategories)
  .post(authUser, controller.createCategory);

router
  .route("/:carId")
  .get(authUser, controller.getCarDetail)
  .put(authUser, controller.updateCar)
  .delete(authUser, controller.deleteCar);

router
  .route("/categories/:categoryId")
  .get(authUser, controller.getCategoryDetail)
  .put(authUser, controller.updateCategory)
  .delete(authUser, controller.deleteCategory);

module.exports = router;
