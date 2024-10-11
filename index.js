const debug = require("debug")("app:debug");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const winston = require("winston");
const app = express();

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();
require("./startup/prod")(app);

// Templating Engines
app.set("view engine", "pug");
app.set("views", "./views");

// Default Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());

// Debugging
if (app.get("env") === "development") {
    app.use(morgan("tiny"));
    debug("Morgan connected...");
};

const port = process.env.PORT || 3000;
const server = app.listen(port , () => {
    winston.info(`Listening on port ${port} ...`);
});

module.exports = server;
