const express = require("express");
const router = express.Router();
const scedules = require("../controllers/schedules.controller");

const { getSchedule } = scedules;
router.get("/calculate", getSchedule);

module.exports = router;
