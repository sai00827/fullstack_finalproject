const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "grains",
        "vegetables",
        "pulses",
        "fruits",
        "oils",
        "dairy",
        "groceries",
      ],
    },

    pricePerKg: {
      type: Number,
      required: true,
      min: 0.01,
    },

    quantityKg: {
      type: Number,
      required: true,
      min: 0,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    farmerName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["available", "sold_out"],
      default: "available",
    },

    deliveryAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);