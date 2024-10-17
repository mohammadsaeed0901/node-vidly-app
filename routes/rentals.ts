import express, { type Request, type Response } from "express";
import { Rental, validateRental as validate } from "../models/rental";
import { Movie } from "../models/movie";
import { Customer } from "../models/customer";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Rentals
 *   description: API for managing rentals
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The customer ID
 *         name:
 *           type: string
 *           description: The name of the customer
 *         phone:
 *           type: string
 *           description: The customer's phone number
 *       required:
 *         - _id
 *         - name
 *         - phone
 *     Movie:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The movie ID
 *         title:
 *           type: string
 *           description: The title of the movie
 *         dailyRentalRate:
 *           type: number
 *           format: float
 *           description: The daily rental rate of the movie
 *       required:
 *         - _id
 *         - title
 *         - dailyRentalRate
 *     Rental:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The rental ID
 *         customer:
 *           $ref: '#/components/schemas/Customer'
 *         movie:
 *           $ref: '#/components/schemas/Movie'
 *         dateOut:
 *           type: string
 *           format: date-time
 *           description: The date when the rental started
 *         dateReturned:
 *           type: string
 *           format: date-time
 *           description: The date when the rental was returned
 *         rentalFee:
 *           type: number
 *           format: float
 *           description: The rental fee for the movie
 *       required:
 *         - customer
 *         - movie
 */

/**
 * @swagger
 * /api/rentals:
 *   get:
 *     summary: Get all rentals
 *     tags: [Rentals]
 *     responses:
 *       200:
 *         description: A list of rentals
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rental'
 */
router.get("/", async (_, res: Response) => {
    const rentals = await Rental.find().sort("-dateOut");
    res.send(rentals);
});

/**
 * @swagger
 * /api/rentals:
 *   post:
 *     summary: Create a new rental
 *     tags: [Rentals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: string
 *                 description: The ID of the customer renting the movie
 *               movieId:
 *                 type: string
 *                 description: The ID of the movie being rented
 *             required:
 *               - customerId
 *               - movieId
 *     responses:
 *       201:
 *         description: The newly created rental
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rental'
 *       400:
 *         description: Bad request, validation error or invalid customer/movie
 *       500:
 *         description: Internal server error, unable to process the transaction
 */
router.post("/", async (req: Request, res: Response) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send("Invalid customer.");

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send("Invalid movie.");

    if (movie.numberInStock === 0) return res.status(400).send("Movie not in stock.");

    try {
        const rental = new Rental({
            customer: {
                _id: customer._id,
                name: customer.name,
                phone: customer.phone,
            },
            movie: {
                _id: movie._id,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate,
            },
        });
    
        await rental.save();
    
        movie.numberInStock--;
        await movie.save();
    
        res.status(201).send(rental);
    } catch (ex) {
        res.status(500).send("Internal Server Error");
    }
});

export default router;