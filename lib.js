
module.exports.absolute = function(number) {
    return (number >= 0) ? number : -number;
}

module.exports.greet = function(name) {
    return "Welcome " + name + "!";
}

module.exports.getCurrencies = function() {
    return ["EUR", "RIAL", "USD"];
}

module.exports.getProduct = function(productId) {
    return { id: productId, price: 10 };
}

module.exports.registerUser = function(username) {
    if (!username) throw new Error("Username is required.");

    return { id: new Date().getTime(), username: username };
}