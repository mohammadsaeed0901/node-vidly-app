const lib = require("../lib");

describe("absolute", () => {
    it("should return a positive number if input is positive.", () => {
        const result = lib.absolute(1);
        expect(result).toBe(1);
    });
    
    it("should return a positive number if input is negative.", () => {
        const result = lib.absolute(-1);
        expect(result).toBe(1);
    });
    
    it("should return 0 if input is 0.", () => {
        const result = lib.absolute(0);
        expect(result).toBe(0);
    });
});

describe("greet", () => {
    it("should return the greeting message", () => {
        const result = lib.greet("Saeed");
        expect(result).toMatch(/Saeed/);
    });
});

describe("getCurrencies", () => {
    it("should return supported currencies", () => {
        const result = lib.getCurrencies();
        expect(result).toEqual(expect.arrayContaining(["RIAL", "EUR", "USD"]));
    });
});

describe("getProduct", () => {
    it("should return the product wtih the given id", () => {
        const result = lib.getProduct(1);
        expect(result).toEqual({ id: 1, price: 10 });       // Match exact object
        expect(result).toMatchObject({ id: 1, price: 10 }); // Match part of object

        expect(result).toHaveProperty("id", Number("1"));
    });
});

describe("registerUser", () => {
    it("should throw if username is falsy", () => {
        const args = [null, undefined, NaN, "", 0, false];
        args.forEach(arg => {
            expect(() => { lib.registerUser(arg) }).toThrow();
        });
    });

    it("should return a user object if valid username is passed", () => {
        const result = lib.registerUser("saeed");
        expect(result).toMatchObject({ username: "saeed" });
        expect(result.id).toBeGreaterThan(0);
    });
});
