const usersRepo = require("../services/user.repository");

const PRICE_RANGE_MAP = {
  LT_5: { min: 0, max: 5_000_000 },
  "5_10": { min: 5_000_000, max: 10_000_000 },
  "10_20": { min: 10_000_000, max: 20_000_000 },
  GT_20: { min: 20_000_000, max: null },
};

const PURPOSES = new Set([
  "CHUP_ANH",
  "GAME",
  "PIN_TRAU",
  "NHO_GON",
  "CONG_VIEC",
]);
const OS = new Set(["IOS", "ANDROID", "ANY"]);
const PRIORITIES = new Set([
  "CAMERA",
  "GAMING",
  "BATTERY",
  "COMPACT",
  "WORK",
  "PRICE",
  "BRAND",
]);

function onboarding(req, res, next) {
  try {
    const userId = req.user.id;
    const body = req.body || {};

    const priceRange = body.priceRange
      ? String(body.priceRange).toUpperCase()
      : null;
    const range = priceRange ? PRICE_RANGE_MAP[priceRange] : null;

    const onboarding = {
      priceRange: range ? priceRange : null,

      // auto fill budget from priceRange (nếu có)
      budgetMin: range ? range.min : body.budgetMin ?? null,
      budgetMax: range ? range.max : body.budgetMax ?? null,

      purposes: Array.isArray(body.purposes)
        ? body.purposes
            .map((x) => String(x).toUpperCase())
            .filter((x) => PURPOSES.has(x))
        : [],

      os: OS.has(String(body.os || "ANY").toUpperCase())
        ? String(body.os || "ANY").toUpperCase()
        : "ANY",

      preferredBrands: Array.isArray(body.preferredBrands)
        ? body.preferredBrands.map((x) => String(x).trim()).filter(Boolean)
        : [],

      priorities: Array.isArray(body.priorities)
        ? body.priorities
            .map((x) => String(x).toUpperCase())
            .filter((x) => PRIORITIES.has(x))
            .slice(0, 2)
        : [],

      updatedAt: new Date().toISOString(),
    };

    const updated = usersRepo.updateOnboarding(userId, onboarding);
    if (!updated) return res.status(404).json({ message: "User not found" });

    res.json({ user: usersRepo.toPublicUser(updated) });
  } catch (err) {
    next(err);
  }
}

module.exports = { onboarding };
