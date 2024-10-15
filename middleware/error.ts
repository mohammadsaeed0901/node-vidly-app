import winston from "winston";

const error = (err, req, res, next) => {
    winston.error(err.messsage, err);

    res.status(500).send("Something failed.");
}

export default error;