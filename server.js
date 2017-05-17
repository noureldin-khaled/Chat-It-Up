require('dotenv').config({ silent : true });

var express          = require('express');
var app              = express();
var expressValidator = require('express-validator');
var methodOverride   = require('method-override');
var bodyParser       = require('body-parser');
var morgan           = require('morgan');
var db               = require('./app/database/db');

db.connect(function(err) {
    if (err) {
        console.log('Couldn\'t connect to database.', err);
        process.exit(0);
    }
    else {
        console.log('Connected to database successfully.');

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended : false }));

        app.use(expressValidator());

        app.use(methodOverride());

        app.use(morgan('dev'));

        require('./app/routes/Routes.js')(app);

        var port = (process.env.ENV === 'prod') ? 80 : process.env.PORT;
        app.listen(port, function() {
            console.log('Listening on port ' + port + '...');
        });
    }
});
