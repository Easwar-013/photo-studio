const User = require("../models/User");

// REGISTER
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({
      email
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: "Registration Successful",
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // OWNER LOGIN
    if (
      role === "staff" &&
      email === "MSMAA01" &&
      password === "7639670007"
    ) {
      return res.status(200).json({
        success: true,
        role: "owner",
        message: "Owner Login Successful"
      });
    }

    const user = await User.findOne({
      email,
      role
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found"
      });
    }

    // ACCOUNT CLOSED CHECK
    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Account Closed By Studio"
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password"
      });
    }

    res.status(200).json({
      success: true,
      role: user.role,
      user,
      message: "Login Successful"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  register,
  login
};