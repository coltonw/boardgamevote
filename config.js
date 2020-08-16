var config = {};

config.mongoUri = process.env.MONGODB_ATLAS_URI || "mongodb://localhost/mydb";

config.staticUrl = process.env.STATIC_URL || "http://localhost:3000";

config.blanket = {
    pattern: ["lib", "routes", "schemas"],
    "data-cover-never": "node_modules",
};

module.exports = config;
