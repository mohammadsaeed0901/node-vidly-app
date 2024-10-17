import express from "express";
import { Rental } from "../models/rental";
import { Movie } from "../models/movie";
import auth from "../middleware/auth";
import Joi from "joi";
import moment from "moment";

const router = express.Router();

/**
 * @swagger
 * /api/returns:
 *   post:
 *     summary: Process a movie return
 *     tags: [Returns]
 *     security:
 *       - xAuthToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: string
 *                 description: The ID of the customer
 *               movieId:
 *                 type: string
 *                 description: The ID of the movie
 *     responses:
 *       200:
 *         description: Rental processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rental'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Rental not found
 */
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