const express = require("express");
const router = express.Router();

const {
  getB2BClients
} = require("../controllers/b2bController");

router.get("/", getB2BClients);

module.exports = router;