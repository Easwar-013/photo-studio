const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
{
  name: String,

  phone: String,

  email: {
    type: String,
    unique: true
  },

  isActive: {
    type: Boolean,
    default: true
  }
},
{
  timestamps: true
});

module.exports = mongoose.model("Customer", CustomerSchema);