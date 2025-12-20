const auth = require("../services/auth.service");

function register(req, res, next) {
  try {
    const user = auth.register(req.body || {});
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}

function login(req, res, next) {
  try {
    const result = auth.login(req.body || {});
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };
