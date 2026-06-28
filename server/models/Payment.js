const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  customerId: String,
  amount: Number,
  paymentStatus: String
});

module.exports = mongoose.model("Payment", PaymentSchema);