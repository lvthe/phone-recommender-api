const usersRepo = require("../services/user.repository");

function onboarding(req, res, next) {
  try {
    const userId = req.user.id;
    const body = req.body || {};

    const onboarding = {
      budgetMin: body.budgetMin ?? null,
      budgetMax: body.budgetMax ?? null,
      preferredBrands: Array.isArray(body.preferredBrands) ? body.preferredBrands : [],
      priorities: Array.isArray(body.priorities) ? body.priorities : [],
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
