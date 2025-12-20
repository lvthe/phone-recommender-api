const fs = require("fs");
const path = require("path");

const SESSIONS_PATH = path.join(__dirname, "..", "data", "sessions.json");

function ensureFile() {
  if (!fs.existsSync(SESSIONS_PATH)) {
    fs.writeFileSync(
      SESSIONS_PATH,
      JSON.stringify({ sessions: [] }, null, 2),
      "utf-8"
    );
  }
}

function loadStore() {
  ensureFile();
  try {
    const data = JSON.parse(fs.readFileSync(SESSIONS_PATH, "utf-8"));
    if (!data.sessions || !Array.isArray(data.sessions)) data.sessions = [];
    return data;
  } catch {
    return { sessions: [] };
  }
}

function saveStore(store) {
  fs.writeFileSync(SESSIONS_PATH, JSON.stringify(store, null, 2), "utf-8");
}

function pruneExpired(now = Date.now()) {
  const store = loadStore();
  const before = store.sessions.length;
  store.sessions = store.sessions.filter((s) => (s.expiresAt ?? 0) > now);
  if (store.sessions.length !== before) saveStore(store);
}

function createSession({ token, userId, ttlMs }) {
  const store = loadStore();
  const now = Date.now();
  const session = {
    token,
    userId,
    createdAt: new Date(now).toISOString(),
    expiresAt: now + ttlMs,
  };
  store.sessions.push(session);
  saveStore(store);
  return session;
}

function findByToken(token) {
  const store = loadStore();
  return store.sessions.find((s) => s.token === token) || null;
}

function deleteByToken(token) {
  const store = loadStore();
  store.sessions = store.sessions.filter((s) => s.token !== token);
  saveStore(store);
}

module.exports = { pruneExpired, createSession, findByToken, deleteByToken };
