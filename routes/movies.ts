import express, { type Request, type Response } from "express";
import { Movie, validateMovie as validate } from "../models/movie";
import { Genre } from "../models/genre";
import auth from "../middleware/auth";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: API for managing movies
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Genre:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The genre ID
 *         name:
 *           type: string
 *           description: The genre name
 *       required:
 *         - _id
 *         - name
 *     Movie:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The movie ID
 *         title:
 *           type: string
 *           description: The title of the movie
 *         genre:
 *           $ref: '#/components/schemas/Genre'
 *         numberInStock:
 *           type: number
 *           description: The number of movies in stock
 *         dailyRentalRate:
 *           type: number
 *           description: The daily rental rate of the movie
 *       required:
 *         - title
 *         - genre
 *         - numberInStock
 *         - dailyRentalRate
 */

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Get all movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: A list of movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 */
router.get("/", async (_, res: Response) => {
    const movies = await Movie.find().sort("title");
    res.send(movies);
});

/**
 * @swagger
 * /api/movies/{id}:
 *   get:
 *     summary: Get a movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the movie to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A movie object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Movie not found
 */
router.get("/:id", async (req: Request, res: Response) => {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) return res.status(404).send(`Movie with id ${req.params.id} was not found.`);

    res.send(movie);
});

/**
 * @swagger
 * /api/movies:
 *   post:
 *     summary: Create a new movie
 *     tags: [Movies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               genreId:
 *                 type: string
 *                 description: The ID of the genre
 *               numberInStock:
 *                 type: number
 *               dailyRentalRate:
 *                 type: number
 *             required:
 *               - title
 *               - genreId
 *               - numberInStock
 *               - dailyRentalRate
 *     responses:
 *       201:
 *         description: The newly created movie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Bad request, validation failed
 */
router.post("/", auth, async (req: Request, res: Response) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(404).send(`Genre with id ${req.body.genreId} was not found.`);

    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name,
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
    });

    await movie.save();

    res.send(movie);
});

/**
 * @swagger
 * /api/movies/{id}:
 *   put:
 *     summary: Update a movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the movie to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               genreId:
 *                 type: string
 *                 description: The ID of the genre
 *               numberInStock:
 *                 type: number
 *               dailyRentalRate:
 *                 type: number
 *             required:
 *               - title
 *               - genreId
 *               - numberInStock
 *               - dailyRentalRate
 *     responses:
 *       200:
 *         description: The updated movie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Bad request, validation failed
 *       404:
 *         description: Movie not found
 */
router.put("/:id", auth, async (req: Request, res: Response) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(404).send(`Genre with id ${req.body.genreId} was not found.`);

    const movie = await Movie.findByIdAndUpdate(req.params.id, 
        { 
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name,
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate,
        },
        {
            new: true,
        }
    );

    if (!movie) 
        return res.status(404).send(`Movie with id ${req.params.id} was not found.`);

    res.send(movie);
})

/**
 * @swagger
 * /api/movies/{id}:
 *   delete:
 *     summary: Delete a movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the movie to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *       404:
 *         description: Movie not found
 */
router.delete("/:id", auth, async (req, res) => {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie)
        return res.status(404).send(`Movie with id ${req.params.id} was not found.`);

    res.send("OK!");
})

export default router;