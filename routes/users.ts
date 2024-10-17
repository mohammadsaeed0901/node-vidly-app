import express from "express";
import bcrypt from "bcrypt";
import auth from "../middleware/auth";
import _ from "lodash";
import { User, validateUser as validate } from "../models/user";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the user
 *           example: "John Doe"
 *         email:
 *           type: string
 *           description: The email of the user
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           description: The password of the user (not returned in responses)
 *           example: "password123"
 *     UserResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *     UserRegistrationResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         token:
 *           type: string
 *           description: JWT token
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user information
 *     tags: [Users]
 *     security:
 *       - xAuthToken: []
 *     responses:
 *       200:
 *         description: The current user information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Unauthorized
 */
router.get("/me", auth, async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
})

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *         headers:
 *           x-auth-token:
 *             description: The JWT token for the created user
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRegistrationResponse'
 *       400:
 *         description: Bad request (e.g. invalid data or email already registered)
 */
router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registerd.");

    user = new User(_.pick(req.body, ["name", "email", "password"]));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = user.generateAuthToken();

    res.header("x-auth-token", token).send(_.pick(user, ["_id", "name", "email"]));
});

export default router;