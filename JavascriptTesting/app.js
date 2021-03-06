
/**
 * Module dependencies.
 */

var express = require('express');
var earth = require('./routes/earth');
var http = require('http');
var path = require('path');
var hbs = require('hbs');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', hbs.__express);

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/',  earth.index);
app.get('/locations', earth.locations)
app.get('/suntimes/:id', earth.suntimes);
app.get('/elevation/:id', earth.elevation);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
