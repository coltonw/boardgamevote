// index.js
var express = require("express"),
    logfmt = require("logfmt"),
    dust = require('dustjs-linkedin'),
    cons = require('consolidate'),
    routes = require('./routes'),
    bodyParser = require('body-parser'),
    app = express(),
    verbose = true;

app.use(logfmt.requestLogger());

// Use dust templating engine for views
app.engine('dust', cons.dust);
app.set('template_engine', 'dust');
app.set('views', __dirname + '/views');
app.set('view engine', 'dust');
app.use(express.favicon());

// parse request bodies (req.body)
app.use(bodyParser());

// load routes
require('./lib/boot')(app, { verbose: verbose });
app.get('/', routes.index);

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});