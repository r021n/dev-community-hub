const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  if (token == undefined || token == null) {
    return res.status(401).json({ message: "Silahkan login dulu" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403);
    }

    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
