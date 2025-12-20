const fs = require("fs");
const path = require("path");

const USERS_PATH = path.join(__dirname, "..", "data", "users.json");

function ensureFile() {
  if (!fs.existsSync(USERS_PATH)) {
    fs.writeFileSync(
      USERS_PATH,
      JSON.stringify({ seq: 1, users: [] }, null, 2),
      "utf-8"
    );
  }
}

function loadStore() {
  ensureFile();
  const raw = fs.readFileSync(USERS_PATH, "utf-8");
  try {
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object") throw new Error("Invalid store");
    if (!Array.isArray(data.users)) data.users = [];
    if (!Number.isFinite(Number(data.seq))) data.seq = 1;
    return data;
  } catch {
    // nếu file hỏng, reset cho demo
    return { seq: 1, users: [] };
  }
}

function saveStore(store) {
  fs.writeFileSync(USERS_PATH, JSON.stringify(store, null, 2), "utf-8");
}

function findByEmail(email) {
  const store = loadStore();
  const e = String(email || "")
    .toLowerCase()
    .trim();
  return store.users.find((u) => u.email === e) || null;
}

function findById(id) {
  const store = loadStore();
  const n = Number(id);
  return store.users.find((u) => u.id === n) || null;
}

function createUser({ email, name, salt, passwordHash }) {
  const store = loadStore();

  const user = {
    id: store.seq++,
    email: String(email).toLowerCase().trim(),
    name: String(name || "").trim(),
    salt,
    passwordHash,
    onboarding: null,
    createdAt: new Date().toISOString(),
  };

  store.users.push(user);
  saveStore(store);
  return user;
}

function updateOnboarding(userId, onboarding) {
  const store = loadStore();
  const n = Number(userId);
  const u = store.users.find((x) => x.id === n);
  if (!u) return null;

  u.onboarding = onboarding;
  saveStore(store);
  return u;
}

function toPublicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    onboarding: user.onboarding,
    createdAt: user.createdAt,
  };
}

module.exports = {
  findByEmail,
  findById,
  createUser,
  updateOnboarding,
  toPublicUser,
};
