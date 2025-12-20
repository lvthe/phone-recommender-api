const repo = require("../services/phone.repository");
const { recommendSimilarPhones } = require("../services/recommendation.service");
const { env } = require("../config/env");

function clampInt(value, min, max, fallback) {
  const n = Number.parseInt(String(value), 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function getAllProducts(req, res) {
  res.json(repo.findAll());
}

function getProductWithRecommendations(req, res, next) {
  try {
    const { id } = req.params;
    const k = clampInt(req.query.k, env.K_MIN, env.K_MAX, env.K_DEFAULT);

    const phone = repo.findById(id);
    if (!phone) return res.status(404).json({ message: `Không tìm thấy sản phẩm id=${id}` });

    const recommendations = recommendSimilarPhones(id, k);
    res.json({ phone, recommendations, k });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllProducts, getProductWithRecommendations };
