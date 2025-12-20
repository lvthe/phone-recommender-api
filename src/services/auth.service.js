const { hashPassword, newSalt, newToken } = require("../utils/security");
const usersRepo = require("./user.repository");
const sessionsRepo = require("./session.repository");

const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24h

function register({ email, password, name }) {
  const e = String(email || "")
    .toLowerCase()
    .trim();
  const p = String(password || "");
  const n = String(name || "").trim();

  if (!e || !p || !n) {
    const err = new Error("Thiếu email/password/name");
    err.status = 400;
    throw err;
  }
  if (usersRepo.findByEmail(e)) {
    const err = new Error("Email đã tồn tại");
    err.status = 409;
    throw err;
  }

  const salt = newSalt();
  const passwordHash = hashPassword(p, salt);
  const user = usersRepo.createUser({ email: e, name: n, salt, passwordHash });
  return usersRepo.toPublicUser(user);
}

function login({ email, password }) {
  const e = String(email || "")
    .toLowerCase()
    .trim();
  const p = String(password || "");
  if (!e || !p) {
    const err = new Error("Thiếu email/password");
    err.status = 400;
    throw err;
  }

  const user = usersRepo.findByEmail(e);
  if (!user) {
    const err = new Error("Sai email hoặc mật khẩu");
    err.status = 401;
    throw err;
  }

  const ph = hashPassword(p, user.salt);
  if (ph !== user.passwordHash) {
    const err = new Error("Sai email hoặc mật khẩu");
    err.status = 401;
    throw err;
  }

  const token = newToken();
  sessionsRepo.createSession({ token, userId: user.id, ttlMs: SESSION_TTL_MS });

  return {
    token,
    expiresInMs: SESSION_TTL_MS,
    user: usersRepo.toPublicUser(user),
  };
}

function verifyToken(token) {
  sessionsRepo.pruneExpired();

  const s = sessionsRepo.findByToken(String(token || "").trim());
  if (!s) return null;

  if ((s.expiresAt ?? 0) <= Date.now()) {
    sessionsRepo.deleteByToken(s.token);
    return null;
  }

  return usersRepo.findById(s.userId);
}

module.exports = { register, login, verifyToken };
