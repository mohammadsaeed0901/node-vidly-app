import winston from "winston";
import mongoose from "mongoose";
import config from "config";

export default function () {
    const db = config.get("db");
    mongoose.connect(config.get("db"))
    .then(() => winston.info(`Connected to ${db}...`));
}