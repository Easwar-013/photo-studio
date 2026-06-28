const mongoose = require("mongoose");

const StaffSchema = new mongoose.Schema(
{
  staffId: {
    type: String,
    required: true,
    unique: true
  },

  name: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  department: {
    type: String,
    required: true
  },

  salary: {
    type: Number,
    required: true
  },

  password: {
    type: String,
    required: true
  }
},
{
  timestamps: true
});

module.exports = mongoose.model("Staff", StaffSchema);