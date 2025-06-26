const express = require("express");
const router = express.Router();
const placeTagController = require("../controllers/placeTagController");

router.get("/", placeTagController.getAll);
router.post("/", placeTagController.create);
router.delete("/", placeTagController.remove);

module.exports = router;
