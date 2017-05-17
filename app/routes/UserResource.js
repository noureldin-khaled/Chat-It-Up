module.exports = function(app) {
    var UserController = require('../controllers/UserController');
    var auth = require('../middlewares/AuthMiddleware');

    app.get('/api/user', auth, UserController.index);
    app.put('/api/user', auth, UserController.update);
};
