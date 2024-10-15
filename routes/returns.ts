import express from "express";
import { Rental } from "../models/rental";
import { Movie } from "../models/movie";
import auth from "../middleware/auth";
import Joi from "joi";
import moment from "moment";

const router = express.Router();

router.post("/", auth, async (req, res) => {
    const { error } = validateReturn(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    const rental = await Rental.findOne({
        'customer._id': req.body.customerId,
        'movie._id': req.body.movieId,
    });
    if (!rental) return res.status(404).send("Rental not found.");

    if (rental.dateReturned) return res.status(400).send("Return already processed.");

    rental.dateReturned = new Date();
    const rentalDays = moment().diff(rental.dateOut, "days");
    rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
    await rental.save();

    await Movie.updateOne({ _id: rental.movie._id }, {
        $inc: { numberInStock: 1 }
    });

    return res.send(rental);
});

const validateReturn = (req) => {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required(),
    });

    return schema.validate(req);
}

export default router;