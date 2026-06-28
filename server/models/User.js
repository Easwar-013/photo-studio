const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["owner", "staff", "customer", "b2b"]
  },
  isActive: {
  type: Boolean,
  default: true
}
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);