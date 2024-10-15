import request from "supertest";
import app from "../../src/index";
import { User } from "../../models/user";
import { Genre } from "../../models/genre";
import { App } from "supertest/types";

describe("integration auth middleware", () => {  
    let server: App;
    let token: string;

    beforeEach(async () => { 
        server = app.listen();
        token = new User().generateAuthToken();
     });

    afterEach(async () => { 
        await Genre.deleteMany({});
        app.close();
     });

    const exec = () => {
        return request(server)
            .post("/api/genres")
            .set("x-auth-token", token)
            .send({ name: "genre1" });
    }

    it("should return 401 if no token is provided", async () => {
        token = "";

        const res = await exec();
    
        expect(res.status).toBe(401);
    });

    it("should return 401 if token is valid", async () => {
        const res = await exec();
    
        expect(res.status).toBe(200);
    });
});