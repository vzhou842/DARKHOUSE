var express = require('express');
var path = require('path');
var DarkhouseController = require('./darkhouse');

var app = express();

var CLIENT_DIR = path.join(__dirname, '../client');
var SHARED_DIR = path.join(__dirname, '../shared');

//start listening
var port = process.env.PORT || '3000';
var server = app.listen(port);

// Setup Socket.io / Game
var io = require('socket.io')(server);
var darkhouse = new DarkhouseController(io);

io.on('connection', function(socket) {
	console.log('connection with socket ' + socket.id);
	darkhouse.onConnection(socket);
});

// Setup Jade
app.set('views', path.join(CLIENT_DIR, '/views'));
app.set('view engine', 'jade');

// Middleware
app.use(express.static(CLIENT_DIR, { maxAge: '8h' }));
app.use(express.static(SHARED_DIR, { maxAge: '8h' }))

// Routes
app.get('/', function(req, res, next) {
	res.render('index', { title: 'DARKHOUSE' });
});
app.get('/:gameID', function(req, res, next) {
	res.render('index', { title: 'DARKHOUSE', gameID: req.params.gameID });
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});