var config = {}

config.mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/mydb';

config.staticUrl =  process.env.STATIC_URL || 'http://localhost:3000';

module.exports = config;