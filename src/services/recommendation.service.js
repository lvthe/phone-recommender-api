const repo = require("./phone.repository");
const { computeMinMax, minMaxNormalize, euclidDistance } = require("../utils/math");

function toFeatureVector(phone) {
  return [Number(phone.price), Number(phone.ramGb), Number(phone.storageGb), Number(phone.batteryMah), Number(phone.cameraMp)];
}

function buildCache() {
  const all = repo.findAll();
  const vectors = all.map(toFeatureVector);
  const { minVal, maxVal } = computeMinMax(vectors);
  const byId = new Map();
  const normById = new Map();
  for (const p of all) {
    const id = Number(p.id);
    byId.set(id, p);
    normById.set(id, minMaxNormalize(toFeatureVector(p), minVal, maxVal));
  }
  return { all, byId, normById };
}
let CACHE = buildCache();

function recommendSimilarPhones(targetId, k) {
  const tId = Number(targetId);
  if (!Number.isFinite(tId)) { const e = new Error("id không hợp lệ"); e.status = 400; throw e; }
  const target = CACHE.byId.get(tId);
  if (!target) { const e = new Error(`Không tìm thấy sản phẩm id=${tId}`); e.status = 404; throw e; }

  const vTarget = CACHE.normById.get(tId);
  const scored = [];
  for (const p of CACHE.all) {
    const pid = Number(p.id);
    if (pid === tId) continue;
    const v = CACHE.normById.get(pid);
    scored.push({ phone: p, distance: euclidDistance(vTarget, v) });
  }
  scored.sort((a, b) => a.distance - b.distance);
  return scored.slice(0, k).map(x => x.phone);
}

module.exports = { recommendSimilarPhones };
