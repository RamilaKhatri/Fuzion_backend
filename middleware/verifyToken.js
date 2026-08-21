const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({
      message: "Access Denied. No Token Provided",
    });
  }

  // Remove "Bearer " from the token
  const token = authHeader.replace("Bearer ", "");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({
      message: "Invalid Token",
    });
  }
};

module.exports = verifyToken;