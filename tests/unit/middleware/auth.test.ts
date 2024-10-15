import { NextFunction, Request, Response } from "express";
import auth from "../../../middleware/auth";
import { User } from "../../../models/user";
import mongoose from "mongoose";

describe("auth middleware", () => {
    it("should populate req.user with the payload of a valid JWT", () => {
        const user = { _id: new mongoose.Types.ObjectId().toHexString(), isAdmin: true };
        const token = new User(user).generateAuthToken();

        const req: Partial<Request> & { user?: any } = {
            header: jest.fn().mockReturnValue(token),
        };

        const res: Partial<Response> = {};
        const next: NextFunction  = jest.fn();

        auth(req as Request, res as Response, next);

        expect(req.user).toMatchObject(user);
    });
});