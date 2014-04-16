var express = require('express'),
    fs = require('fs'),
    config = require('../config.js'),
    mongoClient = require('mongodb').MongoClient;

module.exports = function(parent, options){
    var verbose = options.verbose,
        app = express();

    // database middleware
    app.all('*', function(req, res, next) {
        mongoClient.connect(config.mongoUri, function (err, db) {
            if(err) {
                throw err;
            }
            req.db = db;
            next();
        });
    });
    parent.use(app);
};