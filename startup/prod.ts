import helmet from "helmet";
import compression from "compression";
import { type Application } from "express";

export default function(app: Application) {
    app.use(helmet());
    app.use(compression());
}