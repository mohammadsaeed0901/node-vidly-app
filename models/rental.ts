import mongoose, { type Document } from "mongoose";
import Joi from "joi";

const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50,
            },
            isGold: {
                type: Boolean,
                default: false,
            },
            phone: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50,
            },
        }),
        required: true,
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 5,
                maxlength: 255,
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                minlength: 0,
                maxlength: 255,
            },
        }),
        required: true,
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now,
    },
    dateReturned: {
        type: Date,
    },
    rentalFee: {
        type: Number,
        min: 0,
    },
});

export interface IRentalDocument extends Document {
    customer: { _id: string; name: string; isGold: boolean; phone: string };
    movie: { _id: string; title: string; dailyRentalRate: number };
    dateOut: Date;
    dateReturned?: Date;
    rentalFee?: number;
}

const Rental = mongoose.model<IRentalDocument>("Rental", rentalSchema);

const validateRental = (rental) => {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required(),
    });

    return schema.validate(rental, {
        abortEarly: false,
    });
}

export {
    Rental,
    validateRental
}
