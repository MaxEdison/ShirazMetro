const data = require("../utils/data");

const { stationsList } = data;

const getStations = async (req, res) => {
  res.json(stationsList);
};

module.exports = { getStations };
