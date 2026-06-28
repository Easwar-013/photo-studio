const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema(
  {
    staffId: String,

    month: String,

    baseSalary: Number,

    attendedDays: Number,

    leaveDays: Number,

    deduction: Number,

    salary: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payroll", payrollSchema);