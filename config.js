var config = {}

config.mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/mydb';

config.staticUrl =  process.env.STATIC_URL || 'http://localhost:3000';

config.blanket = {
    "pattern": ["lib","routes","schemas"],
    "data-cover-never": "node_modules"
};

module.exports = config;