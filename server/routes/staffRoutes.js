const express = require("express");
const router = express.Router();

const {
  getStaffs,
  createStaff,
  updateStaff,
  deleteStaff,
  loginStaff
} = require("../controllers/staffController");

router.get("/", getStaffs);

router.post("/", createStaff);

router.post("/login", loginStaff);

router.put("/:id", updateStaff);

router.delete("/:id", deleteStaff);


module.exports = router;