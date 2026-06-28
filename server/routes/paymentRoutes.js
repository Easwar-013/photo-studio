const express = require("express");
const router = express.Router();

const {
  requestPayment,
  approvePayment,
  rejectPayment,
} = require("../controllers/paymentController");

// Customer requests payment
router.post("/request/:id", requestPayment);

// Owner approves payment
router.post("/approve/:id", approvePayment);

// Owner rejects payment
router.post("/reject/:id", rejectPayment);

module.exports = router;