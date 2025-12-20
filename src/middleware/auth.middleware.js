const { verifyToken } = require("../services/auth.service");
const usersRepo = require("../services/user.repository");

function authRequired(req, res, next) {
  const header = req.headers["authorization"] || "";
  const m = String(header).match(/^Bearer\s+(.+)$/i);
  if (!m) return res.status(401).json({ message: "Missing Bearer token" });

  const user = verifyToken(m[1]);
  if (!user) return res.status(401).json({ message: "Invalid token" });

  req.user = usersRepo.toPublicUser(user);
  next();
}

module.exports = { authRequired };
