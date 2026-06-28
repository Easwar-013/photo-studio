const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  staffId: String,
  checkIn: Date,
  checkOut: Date,
  location: String,
  selfieImage: String
});

module.exports = mongoose.model("Attendance", AttendanceSchema);