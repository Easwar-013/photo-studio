const express = require("express");
const router = express.Router();

const {
  getCustomers,
  closeCustomer,
  activateCustomer,
  deleteCustomer
} = require("../controllers/customerController");

router.get("/", getCustomers);

router.put(
  "/close/:id",
  closeCustomer
);

router.put(
  "/activate/:id",
  activateCustomer
);

router.delete(
  "/:id",
  deleteCustomer
);

module.exports = router;