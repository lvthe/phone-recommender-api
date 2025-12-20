const { hashPassword, newSalt, newToken } = require("../utils/security");
const usersRepo = require("./user.repository");

const tokenToUserId = new Map();

function register({ email, password, name }) {
  const e = String(email || "").toLowerCase().trim();
  const p = String(password || "");
  const n = String(name || "").trim();

  if (!e || !p || !n) { const err = new Error("Thiếu email/password/name"); err.status = 400; throw err; }
  if (usersRepo.findByEmail(e)) { const err = new Error("Email đã tồn tại"); err.status = 409; throw err; }

  const salt = newSalt();
  const passwordHash = hashPassword(p, salt);
  const user = usersRepo.createUser({ email: e, name: n, salt, passwordHash });
  return usersRepo.toPublicUser(user);
}

function login({ email, password }) {
  const e = String(email || "").toLowerCase().trim();
  const p = String(password || "");
  if (!e || !p) { const err = new Error("Thiếu email/password"); err.status = 400; throw err; }

  const user = usersRepo.findByEmail(e);
  if (!user) { const err = new Error("Sai email hoặc mật khẩu"); err.status = 401; throw err; }

  const ph = hashPassword(p, user.salt);
  if (ph !== user.passwordHash) { const err = new Error("Sai email hoặc mật khẩu"); err.status = 401; throw err; }

  const token = newToken();
  tokenToUserId.set(token, user.id);
  return { token, user: usersRepo.toPublicUser(user) };
}

function verifyToken(token) {
  const t = String(token || "").trim();
  const uid = tokenToUserId.get(t);
  if (!uid) return null;
  return usersRepo.findById(uid);
}

module.exports = { register, login, verifyToken };
