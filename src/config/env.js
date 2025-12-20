function getEnv(name, fallback) {
  const v = process.env[name];
  return (v === undefined || v === null || v === "") ? fallback : v;
}

const env = {
  PORT: Number(getEnv("PORT", "8080")),
  CORS_ORIGIN: getEnv("CORS_ORIGIN", "*"),
  K_DEFAULT: Number(getEnv("K_DEFAULT", "3")),
  K_MIN: Number(getEnv("K_MIN", "1")),
  K_MAX: Number(getEnv("K_MAX", "10")),
};

module.exports = { env };
