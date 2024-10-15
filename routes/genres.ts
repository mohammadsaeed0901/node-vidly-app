import express, { Request, Response } from "express";
import auth from "../middleware/auth";
import admin from "../middleware/admin";
import validateObjectId from "../middleware/validateObjectId";
import { Genre, validateGenre as validate } from "../models/genre";

const router = express.Router();

router.get("/", async (_, res) => {    
    const genres = await Genre.find().sort("name");
    res.send(genres);
});

router.get("/:id", validateObjectId, async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    
    if (!genre) return res.status(404).send(`The genre with id ${req.params.id} was not found.`);
    
    res.send(genre);
})

router.post("/", auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    let genre = new Genre({
        name: req.body.name
    });

    genre = await genre.save();
    res.send(genre);
});

router.put("/:id", auth, async (req, res) => {
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

router.delete("/:id", [auth, admin], async (req: Request, res: Response) => {
    const genre = await Genre.findByIdAndDelete(req.params.id);

    if (!genre)
        return res.status(404).send(`The genre with id ${req.params.id} was not found.`);

    res.send(genre);
})

export default router;