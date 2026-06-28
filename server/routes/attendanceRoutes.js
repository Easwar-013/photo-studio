const express = require("express");
const router = express.Router();

const {
getAttendance,
getStaffAttendance,
checkIn,
checkOut,
} = require("../controllers/attendanceController");

const Attendance = require("../models/Attendance");



router.get("/", getAttendance);

router.post("/checkin", checkIn);

router.post("/checkout", checkOut);

router.get("/staff/:staffId", getStaffAttendance);

module.exports = router;
