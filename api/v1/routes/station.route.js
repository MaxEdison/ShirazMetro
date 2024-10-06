const express = require("express");
const router = express.Router();
const stations = require("../controllers/station.controller");

const { getStations } = stations;

router.get("/stations", getStations);

module.exports = router;
