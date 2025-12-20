const crypto = require("crypto");

function hashPassword(password, salt) {
  return crypto.createHash("sha256").update(String(password) + ":" + salt).digest("hex");
}
function newSalt() {
  return crypto.randomBytes(16).toString("hex");
}
function newToken() {
  return crypto.randomBytes(24).toString("hex");
}
module.exports = { hashPassword, newSalt, newToken };
