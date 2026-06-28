  const mongoose = require("mongoose");

  const B2BClientSchema = new mongoose.Schema({
    companyName: String,
    contactPerson: String,
    phone: String,
    email: String
  });

  module.exports = mongoose.model("B2BClient", B2BClientSchema);