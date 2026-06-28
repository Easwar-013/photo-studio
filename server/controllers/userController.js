const getUsers = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "All Users"
  });
};

module.exports = { getUsers };