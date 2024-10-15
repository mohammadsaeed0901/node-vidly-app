import mongoose, { Document, Schema } from "mongoose";
import Joi from "joi";
import jwt from "jsonwebtoken";
import config from "config";
import IUser from "../interfaces/user.interface";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minLength: 5,
        maxLength: 255,
    },
    password: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 1024,
    },
    isAdmin: {
        type: Boolean
    }
});

export interface IUserDocument extends Document {
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
    generateAuthToken: () => string;
}

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get("jwtPrivateKey"));
    return token;
}


const User = mongoose.model<IUserDocument>("User", userSchema);

const validateUser = (user: IUser) => {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(1024).required(),
    });

    return schema.validate(user);
}

export {
    User,
    userSchema,
    validateUser
}
