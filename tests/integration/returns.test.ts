import { IRentalDocument, Rental } from "../../models/rental";
import mongoose from "mongoose";
import request from "supertest";
import { User } from "../../models/user";
import moment from "moment";
import { IMovieDocument, Movie } from "../../models/movie";
import app from "../../src/index";
import { type App } from "supertest/types";

describe("/api/returns", () => {
    let server: App;
    let customerId;
    let movieId;
    let rental: IRentalDocument;
    let movie: IMovieDocument;
    let token: string;

    const exec = () => {
        return request(server)
            .post("/api/returns")
            .set("x-auth-token", token)
            .send({ customerId, movieId });
    }

    beforeEach(async () => {
        server = app.listen();
        customerId = new mongoose.Types.ObjectId();
        movieId = new mongoose.Types.ObjectId();
        token = new User().generateAuthToken();

        movie = new Movie({
            _id: movieId,
            title: "12345",
            dailyRentalRate: 2,
            genre: { name: "genre1" },
            numberInStock: 10,
        });
        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: "customer1",
                phone: "12345",
            },
            movie: {
                _id: movieId,
                title: "movie1",
                dailyRentalRate: 5,
            },
        });
        await rental.save();
     });

    afterEach(async () => { 
        app.close();    
        await Rental.deleteMany({});
        await Movie.deleteMany({});
    });

    it("should return 401 if client is not logged in", async () => {
        token = "";
        
        const res = await exec();

        expect(res.status).toBe(401);
    });

    it("should return 400 if customerId is not provided", async () => {
        customerId = "";

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it("should return 400 if movieId is not provided", async () => {
        movieId = "";

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it("should return 404 if no rental found for the customer/movie", async () => {
        await Rental.deleteOne({});
        
        const res = await exec();

        expect(res.status).toBe(404);
    });

    it("should return 400 if return is already processed", async () => {
        rental.dateReturned = new Date();
        await rental.save();

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it("should return 200 if we have a valid request", async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    });

    it("should set the returnDate if input is valid", async () => {
        await exec();

        const rentalInDb = await Rental.findById(rental._id);

        if (!rentalInDb?.dateReturned) {
            throw new Error("dateReturned is not set");
        }

        const diff = new Date().getTime() - rentalInDb.dateReturned.getTime();

        expect(diff).toBeLessThan(10 * 1000);
    });

    it("should set the rentalFee if input is valid", async () => {
        rental.dateOut = moment().add(-7, "days").toDate();
        await rental.save();

        await exec();

        const rentalInDb = await Rental.findById(rental._id);

        expect(rentalInDb?.rentalFee).toBe(14);
    });

    it("should increase the movie stock if input is valid", async () => {
        await exec();

        const movieInDb = await Movie.findById(movie._id);

        expect(movieInDb?.numberInStock).toBe(movie?.numberInStock + 1);
    });

    it("should return the rental if input is valid", async () => {
        const res = await exec();

        await Rental.findById(rental._id);

        expect(Object.keys(res.body)).toEqual(expect.arrayContaining(["dateOut", "dateReturned", "rentalFee", "customer", "movie"]));
    });
});