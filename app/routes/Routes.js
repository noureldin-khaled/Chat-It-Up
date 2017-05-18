module.exports = function(app) {
    app.get('/', function(req, res) {
        res.sendFile('index.html');
    });

    require('./AuthResource')(app);
    require('./UserResource')(app);
    require('./MessageResource')(app);

    app.use(function(req, res) {
        res.status(404).json({
            status:'Failed',
            message: 'The requested route was not found.'
        });
    });
};
