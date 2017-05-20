module.exports = function(app) {
    app.get('/', function(req, res) {
        res.sendFile('index.html');
    });

    /*****************
    * Auth Recourse *
    *****************/
    require('./AuthResource')(app);

    /*****************
     * User Recourse *
     *****************/
    require('./UserResource')(app);

    /********************
     * Message Recourse *
     ********************/
    require('./MessageResource')(app);

    app.use(function(req, res) {
        res.status(404).json({
            status:'Failed',
            message: 'The requested route was not found.'
        });
    });
};
