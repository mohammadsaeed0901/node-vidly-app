import express from "express";
import auth from "../middleware/auth";
import { Customer, validateCustomer as validate } from "../models/customer";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: API for managing customers
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       required:
 *         - name
 *         - isGold
 *         - phone
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the customer
 *           example: "John Doe"
 *         isGold:
 *           type: boolean
 *           description: If user is gold member or not
 *           example: false
 *         phone:
 *           type: string
 *           description: The phone number of the user
 *           example: "123456789"
 */

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Get all customers
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: A list of customers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 */
router.get("/", async (_, res) => {
    const customers = await Customer.find().sort("name");
    res.send(customers);
});

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Get a customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The customer ID
 *     responses:
 *       200:
 *         description: The customer data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       404:
 *         description: The customer was not found
 */
router.get("/:id", async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    
    if (!customer) return res.status(404).send(`Customer with id ${req.params.id} was not found.`);

    res.send(customer);
});

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
 *     security:
 *       - xAuthToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       201:
 *         description: The customer was created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       400:
 *         description: Bad request, invalid input
 */
router.post("/", auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone,
    });

    customer = await customer.save();
    res.send(customer);
});

/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     summary: Update a customer by ID
 *     tags: [Customers]
 *     security:
 *       - xAuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The customer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       200:
 *         description: The customer was updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: The customer was not found
 */
router.put("/:id", auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, 
        { 
            name: req.body.name,
            isGold: req.body.isGold,
            phone: req.body.phone,
        },
        {
            new: true,
        }
    );

    if (!customer) 
        return res.status(404).send(`The customer with id ${req.params.id} was not found.`);

    res.send(customer);
})

/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     summary: Delete a customer by ID
 *     tags: [Customers]
 *     security:
 *       - xAuthToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The customer ID
 *     responses:
 *       200:
 *         description: The customer was deleted successfully
 *       404:
 *         description: The customer was not found
 */
router.delete("/:id", auth, async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer)
        return res.status(404).send(`The customer with id ${req.params.id} was not found.`);

    res.send("OK!");
})

export default router;