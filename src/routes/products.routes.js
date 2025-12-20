const express = require("express");
const router = express.Router();

const { getAllProducts, getProductWithRecommendations } = require("../controllers/products.controller");

router.get("/", getAllProducts);
router.get("/:id", getProductWithRecommendations);

module.exports = router;
