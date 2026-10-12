const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// Get only products that still have quantity
router.get("/", async (req, res, next) => {
  try {
    const { search = "", category, sort = "newest" } = req.query;

    const filter = {
      status: "available",
      quantityKg: { $gt: 0 },
    };

    if (category && category !== "all") {
      filter.category = category;
    }

    if (search.trim()) {
      filter.$or = [
        {
          name: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          location: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    let sortOption = { createdAt: -1 };

    if (sort === "price_low") {
      sortOption = { pricePerKg: 1 };
    }

    if (sort === "price_high") {
      sortOption = { pricePerKg: -1 };
    }

    const products = await Product.find(filter).sort(sortOption);

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
});

// Add a new product
router.post("/", async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    error.status = 400;
    next(error);
  }
});

// Get one product
router.get("/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    error.status = 400;
    next(error);
  }
});

// Update a product
router.patch("/:id", async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    error.status = 400;
    next(error);
  }
});

// Delete a product
router.delete("/:id", async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    error.status = 400;
    next(error);
  }
});

module.exports = router;