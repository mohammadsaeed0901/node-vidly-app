import mongoose, { type Document } from "mongoose";
import Joi from "joi";
import { genreSchema } from "./genre";

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255,
    },
    genre: {
        type: genreSchema,
        required: true,
    },
    numberInStock: {
        type: Number,
        required: true,
        minlength: 0,
        maxlength: 255,
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        minlength: 0,
        maxlength: 255,
    },
})


export interface IMovieDocument extends Document {
    title: string;
    genre: { _id: string; name: string; };
    numberInStock: number;
    dailyRentalRate: number;
}

const Movie = mongoose.model<IMovieDocument>("Movie", movieSchema);

const validateMovie = (movie) => {
    const schema = Joi.object({
        title: Joi.string().min(5).max(255).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).max(255).required(),
        dailyRentalRate: Joi.number().min(0).max(255).required(),
    });

    return schema.validate(movie, {
        abortEarly: false,
    });
}

export {
    Movie,
    validateMovie
}
