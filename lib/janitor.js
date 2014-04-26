// Janitor - a utility for common view controller info and logic

var config = require('../config.js'),
    extend = require('node.extend');

exports.render = function(res, view, locals, callback) {
    var defaults = {
        staticUrl: config.staticUrl
    };
    res.render(view, extend(defaults, locals), callback);
}