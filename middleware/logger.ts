const Log = (req, res, next) => {
    console.log("Logging...");
    next();
};

export default Log;