const express = require("express");
const router = express.Router();
const tourStepController = require("../controllers/tourStepController");

router.use("/", tourStepController);

module.exports = router;
