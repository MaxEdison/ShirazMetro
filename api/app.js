const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const v1 = require("./v1/routes/routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());

app.use("/api/v1/", v1);

module.exports = app;
