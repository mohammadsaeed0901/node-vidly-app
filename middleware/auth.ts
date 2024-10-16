import jwt from "jsonwebtoken";
import config from "config";

function auth(req, res, next) {   
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).send("Access denied. No token provided.");

    try {
        const decodedPayload = jwt.verify(token, config.get("jwtPrivateKey"));
        req.user = decodedPayload;
        next();
    } catch (error) {
        res.status(400).send("Invalid token: ", error);
    }
}

export default auth;