const express = require("express");
const stations = require("./station.route");
const scedules = require("./schedulres.route");
const router = express.Router();

const defaultRoutes = [
  {
    path: "/stations",
    route: stations,
  },
  {
    path: "/scedules",
    route: scedules,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
