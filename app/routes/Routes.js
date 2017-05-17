module.exports = function(app) {
    app.get('/', function(req, res) {
        res.send('Welcome...');
    });

    require('./AuthResource')(app);
    require('./UserResource')(app);

    app.use(function(req, res) {
        res.status(404).json({
            status:'Failed',
            message: 'The requested route was not found.'
        });
    });
};
