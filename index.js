// index.js
var express = require("express"),
    logfmt = require("logfmt"),
    dust = require('dustjs-linkedin'),
    cons = require('consolidate'),
    routes = require('./routes'),
    app = express();

app.use(logfmt.requestLogger());
app.engine('dust', cons.dust);
app.set('template_engine', 'dust');
app.set('views', __dirname + '/views');
app.set('view engine', 'dust');
app.use(express.favicon());

app.get('/', routes.index);

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});