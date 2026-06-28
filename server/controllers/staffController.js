const Staff = require("../models/Staff");

// GET ALL STAFFS
const getStaffs = async (req, res) => {
  try {
    const staffs = await Staff.find();

    res.status(200).json(staffs);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// CREATE STAFF
const createStaff = async (req, res) => {
  try {
    const {
      staffId,
      name,
      phone,
      department,
      salary,
      password
    } = req.body;

    const existingStaff = await Staff.findOne({ staffId });

    if (existingStaff) {
      return res.status(400).json({
        message: "Staff ID already exists"
      });
    }

    const staff = await Staff.create({
      staffId,
      name,
      phone,
      department,
      salary,
      password
    });

    res.status(201).json(staff);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
const updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(staff);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const loginStaff = async (req, res) => {
  try {
    console.log(req.body);
    const { staffId, password } = req.body;

    const staff = await Staff.findOne({
      staffId,
      password
    });

    if (!staff) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials"
      });
    }

    res.json({
      success: true,
      role: "staff",
      staff
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const deleteStaff = async (req, res) => {
  try {
    await Staff.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Staff Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getStaffs,
  createStaff,
  updateStaff,
  deleteStaff,
  loginStaff
};