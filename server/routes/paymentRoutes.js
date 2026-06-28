const express = require("express");
const router = express.Router();

const {
  createOrder,
  makePayment,
} = require("../controllers/paymentController");

// Create Razorpay Order
router.post("/create-order", createOrder);

// Update MongoDB after successful payment
router.post("/pay/:id", makePayment);

module.exports = router;