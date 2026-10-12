const express = require("express");
const mongoose = require("mongoose");

const Order = require("../models/Order");
const Product = require("../models/Product");

const router = express.Router();

// Get all orders
router.get("/", async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("product")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
});

// Create an order
router.post("/", async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    const {
      product: productId,
      buyerName,
      buyerPhone,
      quantityKg,
      deliveryNote = "",
    } = req.body;

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const quantity = Number(quantityKg);

    if (
      !buyerName ||
      !buyerPhone ||
      !Number.isFinite(quantity) ||
      quantity <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid buyer and quantity details are required",
      });
    }

    session.startTransaction();

    const product = await Product.findOne({
      _id: productId,
      status: "available",
      quantityKg: { $gt: 0 },
    }).session(session);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Available product not found",
      });
    }

    if (quantity > product.quantityKg) {
      return res.status(400).json({
        success: false,
        message: "Requested quantity is not available",
      });
    }

    const totalAmount = Number(
      (quantity * product.pricePerKg).toFixed(2)
    );

    const [order] = await Order.create(
      [
        {
          product: product._id,
          buyerName,
          buyerPhone,
          quantityKg: quantity,
          totalAmount,
          deliveryNote,
        },
      ],
      { session }
    );

    product.quantityKg = Number(
      (product.quantityKg - quantity).toFixed(2)
    );

    if (product.quantityKg <= 0) {
      product.quantityKg = 0;
      product.status = "sold_out";
    }

    await product.save({ session });
    await session.commitTransaction();

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    await session.abortTransaction();
    error.status = 400;
    next(error);
  } finally {
    session.endSession();
  }
});

module.exports = router;