import mongoose from "mongoose";
import Joi from "joi";

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
    },
});

const Genre = mongoose.model("Genre", genreSchema);

const validateGenre = (genre) => {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
    });

    return schema.validate(genre, {
        abortEarly: false,
    });
}

export {
    genreSchema,
    Genre,
    validateGenre
}
