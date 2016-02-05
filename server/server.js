var express = require('express');

var app = express();

var CLIENT_DIR = '../client/';

// Setup Jade
app.set('views', CLIENT_DIR + 'views');
app.set('view engine', 'jade');

// Routes
app.get('/', function(req, res, next) {
	res.render('index', { title: 'DARKHORSE' });
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

//start listening
var port = process.env.PORT || '3000';
app.listen(port);