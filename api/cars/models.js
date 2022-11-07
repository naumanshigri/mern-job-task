// Requiring module
const mongoose = require("mongoose");
let Schema = mongoose.Schema;

// Car Schema
const CarSchema = new Schema(
  {
    color: { type: String, required: true }, // sliver
    model: { type: String, required: true }, //812 superfast
    category: { type: mongoose.SchemaTypes.ObjectId, ref: "Categories" }, //
    registrationNo: { type: String, required: true }, //
    ownerId: { type: mongoose.SchemaTypes.ObjectId, ref: "Users" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Categories Schema
const CategoriesSchema = new Schema(
  {
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Creating model objects
const Car = mongoose.model("Car", CarSchema);
const Categories = mongoose.model("Categories", CategoriesSchema);

// Exporting our model objects
module.exports = {
  Categories,
  Car,
};
