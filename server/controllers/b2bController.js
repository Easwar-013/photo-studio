const User = require("../models/User");

// GET ALL B2B CLIENTS
const getB2BClients = async (req, res) => {
  try {
    const clients = await User.find({
      role: "b2b",
    });

    console.log("B2B Clients Found:", clients.length);

    res.status(200).json(clients);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getB2BClients,
};