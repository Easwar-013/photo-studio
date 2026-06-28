const express = require("express");
const router = express.Router();

const {
  getPayroll,
  generatePayroll,
  deletePayroll,
} = require("../controllers/payrollController");

router.get("/", getPayroll);
router.post("/generate", generatePayroll);
router.delete("/:id", deletePayroll);

module.exports = router;