const express = require("express");
const cors = require("cors");

const { env } = require("./config/env");
const productsRoutes = require("./routes/products.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");

function createApp() {
  const app = express();

  app.use(express.json());

  const corsOrigin = env.CORS_ORIGIN === "*" ? "*" : env.CORS_ORIGIN.split(",").map(s => s.trim());
  app.use(cors({ origin: corsOrigin }));

  app.get("/api/health", (req, res) => res.json({ status: "ok" }));

  app.use("/products", productsRoutes);
  app.use("/auth", authRoutes);
  app.use("/user", userRoutes);

  app.use((req, res) => res.status(404).json({ message: "Not Found" }));

  app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({ message: err.message || "Internal Server Error" });
  });

  return app;
}

module.exports = { createApp };
