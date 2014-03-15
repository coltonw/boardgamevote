var config = {}

config.mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/mydb';

config.staticUrl =  process.env.STATIC_URL || 'file:///E:/Users/Will/Documents/bgv-belt/assets/';

module.exports = config;