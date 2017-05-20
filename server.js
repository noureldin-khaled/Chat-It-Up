/* loading the environment variables */
require('dotenv').config({ silent : true });

var express          = require('express');
var app              = express();
var expressValidator = require('express-validator');
var methodOverride   = require('method-override');
var bodyParser       = require('body-parser');
var morgan           = require('morgan');
var db               = require('./app/database/db');

/* connect to the database and initialize the server */
db.connect(function(err) {
    if (err) {
        console.log('Couldn\'t connect to database.', err);
        process.exit(0);
    }
    else {
        console.log('Connected to database successfully.');

        /* serving static files */
        app.use(express.static('public'));

        /* setting up body parser */
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended : false }));

        /*setting up express-validator */
        app.use(expressValidator());

        /* setting up the app to accept (DELETE, PUT...etc requests) */
        app.use(methodOverride());

        /* setting up morgan */
        app.use(morgan('dev'));

        /* initializing routes */
        require('./app/routes/Routes.js')(app);

        /* listen to requests */
        var port = (process.env.ENV === 'prod') ? 80 : process.env.PORT;
        app.listen(port, function() {
            console.log('Listening on port ' + port + '...');
        });
    }
});
