const User = require("../models/User");

// GET ONLY DIRECT CUSTOMERS
const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({
      role: "customer"
    });

    res.json(customers);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// CLOSE CUSTOMER ACCOUNT
const closeCustomer = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // B2B accounts cannot be closed
    if (customer.role === "b2b") {
      return res.status(400).json({
        success: false,
        message: "B2B accounts cannot be deactivated"
      });
    }

    customer.isActive = false;

    await customer.save();

    res.json({
      success: true,
      message: "Customer account deactivated",
      customer
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// ACTIVATE CUSTOMER ACCOUNT
const activateCustomer = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    customer.isActive = true;

    await customer.save();

    res.json({
      success: true,
      message: "Account activated",
      customer
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// DELETE CUSTOMER
const deleteCustomer = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // B2B accounts cannot be deleted
    if (customer.role === "b2b") {
      return res.status(400).json({
        success: false,
        message: "B2B accounts cannot be deleted"
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Customer Deleted Successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getCustomers,
  closeCustomer,
  activateCustomer,
  deleteCustomer
};