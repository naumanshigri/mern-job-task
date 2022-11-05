const mongoose = require("mongoose");

const CarsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Car = mongoose.model("Cars", CarsSchema);

module.exports = Car;
