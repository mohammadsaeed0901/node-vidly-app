const debug = require("debug")("app:debug");
require('dotenv').config();
import express, { type Application } from "express";
import helmet from "helmet";
import morgan from "morgan";
import winston from "winston";
import logging from "../startup/logging";
import routes from "../startup/routes";
import db from "../startup/db";
import config from "../startup/config";
import validation from "../startup/validation";
import prod from "../startup/prod";

const app: Application = express();
const jwtPrivateKey = process.env.VIDLY_JWTPRIVATEKEY;

logging();
routes(app);
db();
config();
validation();
prod(app);

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

if (!jwtPrivateKey) {
    console.error("FATAL ERROR: vidly_jwtPrivateKey is not defined.");
    process.exit(1);
}

const port = process.env.PORT || 3000;
const server = app.listen(port , () => {
    winston.info(`Listening on port ${port} ...`);
});

export default server;
