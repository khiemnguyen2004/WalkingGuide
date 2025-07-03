const express = require("express");
const router = express.Router();
const placeController = require("../controllers/placeController");

// Remove duplicate and incorrect handlers, use only controller
router.get("/", placeController.getAll);
router.get("/search", placeController.getByCity);
router.get("/:id", placeController.getById);
router.post("/", placeController.create);
router.put("/:id", placeController.update);
router.delete("/:id", placeController.delete);

module.exports = router;
