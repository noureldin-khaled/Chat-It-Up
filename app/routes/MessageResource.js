module.exports = function(app) {
    var MessageController = require('../controllers/MessageController');
    var auth = require('../middlewares/AuthMiddleware');

    app.post('/api/message', auth, MessageController.store);
    app.put('/api/message', auth, MessageController.update);
    app.get('/api/message', auth, MessageController.index);
};
