const Attendance = require("../models/Attendance");

// GET ALL ATTENDANCE RECORDS
const getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .sort({ checkIn: -1 });

    res.status(200).json(attendance);
  } catch (error) {
    console.error("GET ATTENDANCE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE STAFF ATTENDANCE
const getStaffAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({
      staffId: req.params.staffId,
    }).sort({ checkIn: -1 });

    res.status(200).json(attendance);
  } catch (error) {
    console.error("GET STAFF ATTENDANCE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// STAFF CHECK IN
const checkIn = async (req, res) => {
  try {
    console.log("CHECK IN REQUEST:", req.body);

    const {
      staffId,
      location,
      selfieImage,
    } = req.body;

    if (!staffId) {
      return res.status(400).json({
        success: false,
        message: "Staff ID is required",
      });
    }

    // Prevent multiple check-ins without checkout
    const existingAttendance = await Attendance.findOne({
      staffId,
      checkOut: { $exists: false },
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: "You are already checked in",
      });
    }

    const attendance = await Attendance.create({
      staffId,
      checkIn: new Date(),
      location: location || "Studio",
      selfieImage: selfieImage || "",
    });

    console.log("ATTENDANCE SAVED:", attendance);

    res.status(201).json({
      success: true,
      message: "Check-In Successful",
      attendance,
    });

  } catch (error) {
    console.error("CHECK IN ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// STAFF CHECK OUT
const checkOut = async (req, res) => {
  try {
    const { id } = req.body;

    console.log("CHECK OUT ID:", id);

    const attendance = await Attendance.findByIdAndUpdate(
      id,
      {
        checkOut: new Date(),
      },
      {
        new: true,
      }
    );

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance Record Not Found",
      });
    }

    console.log("CHECK OUT UPDATED:", attendance);

    res.status(200).json({
      success: true,
      message: "Check-Out Successful",
      attendance,
    });

  } catch (error) {
    console.error("CHECK OUT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAttendance,
  getStaffAttendance,
  checkIn,
  checkOut,
};