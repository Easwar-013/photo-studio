const Payroll = require("../models/Payroll");
const Staff = require("../models/Staff");
const Attendance = require("../models/Attendance");

const generatePayroll = async (req, res) => {
  try {
    const { staffId, month } = req.body;

    const staff = await Staff.findOne({ staffId });

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff Not Found",
      });
    }

    const attendanceRecords = await Attendance.find({
      staffId,
    });

    const attendedDays = attendanceRecords.filter(
      (a) => a.checkOut
    ).length;

    const totalWorkingDays = 30;

    const leaveDays =
      totalWorkingDays - attendedDays;

    const deduction =
      leaveDays > 0
        ? leaveDays * 500
        : 0;

    const finalSalary =
      staff.salary - deduction;

    const payroll = await Payroll.create({
      staffId,
      month,
      baseSalary: staff.salary,
      attendedDays,
      leaveDays,
      deduction,
      salary: finalSalary,
    });

    res.status(201).json({
      success: true,
      message: "Payroll Generated",
      payroll,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL PAYROLLS
const getPayroll = async (req, res) => {
  try {
    const payrolls = await Payroll.find().sort({
      createdAt: -1,
    });

    res.json(payrolls);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deletePayroll = async (req, res) => {
  try {
    await Payroll.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Payroll Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  generatePayroll,
  getPayroll,
  deletePayroll,
};