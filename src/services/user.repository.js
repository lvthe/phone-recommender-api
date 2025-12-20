let _seq = 1;
const users = []; // in-memory

function findByEmail(email) {
  const e = String(email || "").toLowerCase().trim();
  return users.find(u => u.email === e) || null;
}
function findById(id) {
  const n = Number(id);
  return users.find(u => u.id === n) || null;
}
function createUser({ email, name, salt, passwordHash }) {
  const u = {
    id: _seq++,
    email: String(email).toLowerCase().trim(),
    name: String(name || "").trim(),
    salt, passwordHash,
    onboarding: null,
    createdAt: new Date().toISOString()
  };
  users.push(u);
  return u;
}
function updateOnboarding(userId, onboarding) {
  const u = findById(userId);
  if (!u) return null;
  u.onboarding = onboarding;
  return u;
}
function toPublicUser(u) {
  if (!u) return null;
  return { id: u.id, email: u.email, name: u.name, onboarding: u.onboarding, createdAt: u.createdAt };
}
module.exports = { findByEmail, findById, createUser, updateOnboarding, toPublicUser };
