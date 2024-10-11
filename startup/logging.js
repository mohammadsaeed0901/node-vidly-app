// require("winston-mongodb");
require("express-async-errors");
const winston = require("winston");

module.exports = function () {
    // Handling uncaught exceptions
    process.on("uncaughtException", (ex) => {
        winston.error(ex.message, ex);
        process.exit(1);
    });

    // Handling unhandled rejections
    process.on("unhandledRejection", (ex) => {
        winston.error(ex.message, ex);
        process.exit(1);
    });

    // winston.add(new winston.transports.MongoDB({
    //     db: "mongodb://localhost/vidly",
    //     level: "info"   // info severity and higher
    // }));

    winston.add(new winston.transports.File({ 
        filename: "logfile.log",
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json())}));
}