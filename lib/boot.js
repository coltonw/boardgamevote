var express = require("express"),
    fs = require("fs"),
    config = require("../config.js"),
    mongoClient = require("mongodb").MongoClient;

function getDbName(uri) {
    var dbName = uri.slice(uri.lastIndexOf("/") + 1);
    if (dbName.indexOf("?") > 0) {
        dbName = dbName.slice(0, dbName.indexOf("?"));
    }
    return dbName;
}

module.exports = function (parent, options) {
    var verbose = options.verbose,
        app = express();

    // database middleware
    app.all("*", function (req, res, next) {
        mongoClient.connect(config.mongoUri, function (err, client) {
            if (err) {
                throw err;
            }
            req.db = client.db(getDbName(config.mongoUri));
            next();
        });
    });
    parent.use(app);
};
