import error from "../middleware/error";
import genres from "../routes/genres";
import home from "../routes/home";
import customers from "../routes/customers";
import movies from "../routes/movies";
import rentals from "../routes/rentals";
import users from "../routes/users";
import auth from "../routes/auth";
import returns from "../routes/returns";
import express, { type Application } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "../src/swaggerConfig";

export default function (app: Application) {
    app.use(express.json());
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    app.use("/api/genres", genres);
    app.use("/", home);
    app.use("/api/customers", customers);
    app.use("/api/movies", movies);
    app.use("/api/rentals", rentals);
    app.use("/api/users", users);
    app.use("/api/auth", auth);
    app.use("/api/returns", returns);
    app.use(error);
}