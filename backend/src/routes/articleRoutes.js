const express = require("express");
const router = express.Router();
const articleController = require("../controllers/articleController");

router.get("/articles", articleController.getAllArticles);

module.exports = router;
