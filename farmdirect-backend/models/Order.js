const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    buyerName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    buyerPhone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },

    quantityKg: {
      type: Number,
      required: true,
      min: 0.01,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    deliveryNote: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },

    status: {
      type: String,
      enum: ["requested", "accepted", "completed", "cancelled"],
      default: "requested",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);