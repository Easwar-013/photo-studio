const authMiddleware = (req, res, next) => {
  console.log("Auth Middleware");

  next();
};

module.exports = authMiddleware;