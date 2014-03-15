
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

    fs.readdirSync(__dirname + '/../routes').forEach(function(name){
        verbose && console.log('\n   %s:', name);
        var obj = require('./../routes/' + name),
            name = obj.name || name,
            prefix = obj.prefix || '',
            app = express(),
            method,
            path,
            param;

        // before middleware support
        if (obj.before) {
            param = name + '_id';
            app.param(param, obj.before);
            verbose && console.log('     PARAM %s -> before', param);
        }

        // generate routes based
        // on the exported methods
        for (var key in obj) {
            // "reserved" exports
            if (~['name', 'prefix', 'engine', 'before'].indexOf(key)) continue;
            // route exports
            switch (key) {
            case 'show':
                method = 'get';
                path = '/' + name + '/:' + name + '_id';
                break;
            case 'list':
                method = 'get';
                path = '/' + name + 's';
                break;
            case 'edit':
                method = 'get';
                path = '/' + name + '/:' + name + '_id/edit';
                break;
            case 'update':
                method = 'put';
                path = '/' + name + '/:' + name + '_id';
                break;
            case 'create':
                method = 'post';
                path = '/' + name;
                break;
            case 'index':
                method = 'get';
                path = '/' + name;
                break;
            default:
                throw new Error('unrecognized route: ' + name + '.' + key);
            }

            path = prefix + path;
            app[method](path, obj[key]);
            verbose && console.log('     %s %s -> %s', method.toUpperCase(), path, key);
        }

        // mount the app
        parent.use(app);
    });
};