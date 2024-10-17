import express, { Request, Response } from "express";
import auth from "../middleware/auth";
import admin from "../middleware/admin";
import validateObjectId from "../middleware/validateObjectId";
import { Genre, validateGenre as validate } from "../models/genre";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Genres
 *   description: API for managing genres
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     GenreRequest:   # Schema for POST and PUT requests (without _id)
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the genre
 *           example: "Action"
 *     GenreResponse:  # Schema for responses (with _id)
 *       type: object
 *       required:
 *         - _id
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the genre
 *           example: "60c72b2f9b1d8a001c8e4d3e"
 *         name:
 *           type: string
 *           description: The name of the genre
 *           example: "Action"
 */

/**
 * @swagger
 * /api/genres:
 *   get:
 *     summary: Get all genres
 *     tags: [Genres]
 *     responses:
 *       200:
 *         description: A list of genres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GenreResponse'
 */
router.get("/", async (_, res: Response) => {    
    const genres = await Genre.find().sort("name");
    res.send(genres);
});

/**
 * @swagger
 * /api/genres/{id}:
 *   get:
 *     summary: Get a genre by ID
 *     tags: [Genres]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The genre ID
 *     responses:
 *       200:
 *         description: The genre data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenreResponse'
 *       404:
 *         description: The genre was not found
 */
router.get("/:id", validateObjectId, async (req: Request, res: Response) => {
    const genre = await Genre.findById(req.params.id);
    
    if (!genre) return res.status(404).send(`The genre with id ${req.params.id} was not found.`);
    
    res.send(genre);
})

/**
 * @swagger
 * /api/genres:
 *   post:
 *     summary: Create a new genre
 *     tags: [Genres]
 *     security:
 *       - xAuthToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenreRequest'
 *     responses:
 *       201:
 *         description: The genre was created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenreResponse'
 *       400:
 *         description: Bad request, invalid input
 */
router.post("/", auth, async (req: Request, res: Response) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    let genre = new Genre({
        name: req.body.name
    });

    genre = await genre.save();
    res.send(genre);
});

/**
 * @swagger
 * /api/genres/{id}:
 *   put:
 *     summary: Update a genre by ID
 *     tags: [Genres]
 *     security:
 *       - xAuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The genre ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenreRequest'
 *     responses:
 *       200:
 *         description: The genre was updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenreResponse'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: The genre was not found
 */
router.put("/:id", auth, async (req: Request, res: Response) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
        new: true,
    });

    if (!genre) 
        return res.status(404).send(`The genre with id ${req.params.id} was not found.`);

    res.send(genre);
})

/**
 * @swagger
 * /api/genres/{id}:
 *   delete:
 *     summary: Delete a genre by ID
 *     tags: [Genres]
 *     security:
 *       - xAuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The genre ID
 *     responses:
 *       200:
 *         description: The genre was deleted successfully
 *       404:
 *         description: The genre was not found
 */
router.delete("/:id", [auth, admin], async (req: Request, res: Response) => {
    const genre = await Genre.findByIdAndDelete(req.params.id);

    if (!genre)
        return res.status(404).send(`The genre with id ${req.params.id} was not found.`);

    res.send(genre);
})

export default router;