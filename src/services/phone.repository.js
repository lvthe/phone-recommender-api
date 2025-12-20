const phones = require("../data/phones.json");
function findAll() { return phones; }
function findById(id) {
  const nId = Number(id);
  if (!Number.isFinite(nId)) return null;
  return phones.find(p => Number(p.id) === nId) || null;
}
module.exports = { findAll, findById };
