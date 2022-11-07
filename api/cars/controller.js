const { Categories, Car } = require("./models");
const { sendResponse, errReturned } = require("../../utils/dto");
const { SUCCESS, BADREQUEST, NOTFOUND } = require("../../utils/ResponseCodes");
require("dotenv").config();

/**
 * 
 Create Car Records
 */

exports.createCarRecords = async (req, res) => {
  try {
    let ownerId = req.user._id;
    let { name, model, color, categoryId, registrationNo } = req.body;
    let required = ["name", "model", "color", "categoryId", "registrationNo"];

    for (let key of required) {
      if (
        !req["body"][key] ||
        req["body"][key] == "" ||
        req["body"][key] == undefined ||
        req["body"][key] == null
      )
        return sendResponse(res, BADREQUEST, `Please provide ${key}`);
    }

    let checkCar = await Car.findOne({ registrationNo });

    if (checkCar)
      return sendResponse(
        res,
        BADREQUEST,
        "Car Record with this Registration no is already exits"
      );

    let car = new Car({
      name,
      ownerId,
      model,
      color,
      category: categoryId,
      registrationNo,
    });

    await car.save();

    return sendResponse(res, SUCCESS, "Car Record Created", { data: car });
  } catch (error) {
    return errReturned(res, error);
  }
};

/**
 * 
 Get Car List
 */
exports.getCarList = async (req, res) => {
  try {
    let perPage = 5;
    let { pageNo } = req.query;
    let data = (pageNo - 1) * 5;

    let cars = await Car.find().skip(data).limit(perPage); //.populate("category").populate("ownerId");
    let count = await Car.count();
    if (cars === undefined || cars.length == 0)
      return sendResponse(res, SUCCESS, "Record not found");

    return sendResponse(res, SUCCESS, "cars list", {
      count,
      data: cars,
    });
  } catch (error) {
    return errReturned(res, error);
  }
};

/**
 * 
 Car Detail
 */
exports.getCarDetail = async (req, res) => {
  try {
    let { carId } = req.params;
    let car = await Car.findOne({ _id: carId });

    if (!car) return sendResponse(res, NOTFOUND, "Records not found");
    return sendResponse(res, SUCCESS, "Car Detail", {
      data: car,
    });
  } catch (error) {
    return errReturned(res, error);
  }
};

/**
 * 
 Update Car 
 */
exports.updateCar = async (req, res) => {
  try {
    let { carId } = req.params;

    let updateObj = {};
    let allowedKeys = ["name", "model", "color", "categoryId"];

    allowedKeys.forEach((key) => {
      if (req["body"][key]) updateObj[key] = req["body"][key];
    });

    if (Object.keys(updateObj).length === 0)
      return sendResponse(res, BADREQUEST, "Please Provide Valid Key");

    let car = await Car.findOneAndUpdate(
      { _id: carId },
      { $set: updateObj },
      { new: true }
    ).exec();

    if (!car) return sendResponse(res, NOTFOUND, "Record not found");

    return sendResponse(res, SUCCESS, "car updated", { data: car });
  } catch (error) {
    return errReturned(res, error);
  }
};

/**
 * 
 Detele Car
 */
exports.deleteCar = async (req, res) => {
  try {
    let { carId } = req.params;
    let car = await Car.findOneAndDelete({ _id: carId });
    if (!car) return sendResponse(res, SUCCESS, "Records not found");
    return sendResponse(res, SUCCESS, "Car Deleted", { data: car });
  } catch (error) {
    return errReturned(res, error);
  }
};

/**
 * 
 Create Category
 */
exports.createCategory = async (req, res) => {
  try {
    let { name } = req.body;
    let required = ["name"];

    for (let key of required) {
      if (
        !req["body"][key] ||
        req["body"][key] == "" ||
        req["body"][key] == undefined ||
        req["body"][key] == null
      )
        return sendResponse(res, BADREQUEST, `Please provide ${key}`);
    }

    let checkCategory = await Categories.findOne({ name });

    if (checkCategory) return sendResponse(res, SUCCESS, "Category exits");

    let category = new Categories({
      name,
    });
    await category.save();

    return sendResponse(res, SUCCESS, "Category created", { data: category });
  } catch (error) {
    return errReturned(res, error);
  }
};

/**
 * 
 Category list
 */
exports.getCategories = async (req, res) => {
  try {
    let perPage = 5;
    let { pageNo } = req.query;
    let data = (pageNo - 1) * 5;

    let category = await Categories.find().skip(data).limit(perPage);
    let count = await Categories.count();
    if (category === undefined || category.length == 0)
      return sendResponse(res, NOTFOUND, "Record not found");

    return sendResponse(res, SUCCESS, "category list", {
      count,
      data: category,
    });
  } catch (error) {
    return errReturned(res, error);
  }
};

/**
 * 
 Category Detail
 */
exports.getCategoryDetail = async (req, res) => {
  try {
    let { categoryId } = req.params;
    let category = await Categories.findOne({ _id: categoryId });

    if (!category) return sendResponse(res, NOTFOUND, "Records not found");
    return sendResponse(res, SUCCESS, "Category Detail", {
      data: category,
    });
  } catch (error) {
    return errReturned(res, error);
  }
};

/**
 * 
 Update Category
 */
exports.updateCategory = async (req, res) => {
  try {
    let { name } = req.body;
    let required = ["name"];
    let { categoryId } = req.params;

    for (let key of required) {
      if (
        !req["body"][key] ||
        req["body"][key] == "" ||
        req["body"][key] == undefined ||
        req["body"][key] == null
      )
        return sendResponse(res, BADREQUEST, `Please provide ${key}`);
    }

    let category = await Categories.findOneAndUpdate(
      { _id: categoryId },
      { name },
      { new: true }
    );

    if (!category) return sendResponse(res, NOTFOUND, "Record not found");

    return sendResponse(res, SUCCESS, "category updated", { data: category });
  } catch (error) {
    return errReturned(res, error);
  }
};

/**
 * 
 Detele Category
 */
exports.deleteCategory = async (req, res) => {
  try {
    let { categoryId } = req.params;
    let category = await Categories.findOneAndDelete({ _id: categoryId });
    if (!category) return sendResponse(res, NOTFOUND, "Records not found");
    return sendResponse(res, SUCCESS, "Category Deleted", { data: category });
  } catch (error) {
    return errReturned(res, error);
  }
};
