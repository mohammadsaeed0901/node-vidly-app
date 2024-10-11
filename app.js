const EventEmitter = require("events");
const http = require("http");
const Express = require("express");

const server = http.createServer((req, res) => {
    if (req.url === "/") {
        res.write("Hello world");
        res.end();
    }

    if (req.url === "/api/courses") {
        res.write(JSON.stringify([1, 2, 3]));
        res.end();
    }
});

server.listen(3000);

console.log("listening on port 3000...");

// const Logger = require("./logger")
// const logger = new Logger()

// logger.on("messageLogged", (args) => {
//     console.log("Listenning to", args);
// })

// logger.log("Message")