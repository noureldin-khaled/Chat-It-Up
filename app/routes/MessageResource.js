module.exports = function(app) {
    var MessageController = require('../controllers/MessageController');
    var auth = require('../middlewares/AuthMiddleware');

    /**
    * A POST route responsible for storing a message in the database.
    * @var /api/message POST
    * @name /api/message POST
    * @example the route expects the access token as 'Authorization' in the request headers
    * @example The route expects a body Object in the following format
    * {
    *   content: String, [required]
    *   recipient: String [required]
    * }
    * @example The route returns as a response an object in the following format
    * {
    * 	status: Succeeded/Failed,
    * 	message: String showing a descriptive text,
    * 	errors:
    * 	[
    * 	  {
    * 	     param: the field that caused the error,
    * 	     value: the value that was provided for that field,
    * 	     msg: the type of error that was caused ['required']
    * 	  }, {...}, ...
    * 	]
    * }
    */
    app.post('/api/message', auth, MessageController.store);

    /**
    * A PUT route responsible for update the information of messages in the database.
    * @var /api/message PUT
    * @name /api/message PUT
    * @example the route expects the access token as 'Authorization' in the request headers
    * @example The route expects a body Object in the following format
    * {
    *   sender: String, [required]
    * }
    * @example The route returns as a response an object in the following format
    * {
    * 	status: Succeeded/Failed,
    * 	message: String showing a descriptive text
    * }
    */
    app.put('/api/message', auth, MessageController.update);

    /**
    * A GET route responsible for getting all message for the authenticated user.
    * @var /api/message GET
    * @name /api/message GET
    * @example the route expects the access token as 'Authorization' in the request headers
    * @example The route returns as a response an object in the following format
    * {
    * 	status: Succeeded/Failed,
    * 	message: String showing a descriptive text,
    * 	result:
    * 	[
    * 	  {
    * 	     _id: the id of a user in the database,
    * 	     online: if the recipient is currently online, [true, false]
    * 	     messages: the messages between the authenticated user and the current user in the array
    * 	     [
    * 	       {
    *               _id: id of the message,
    *               content: content of the message,
    *               seen: if the message has been seen, [true, false]
    *               sender: the id of the sender,
    *               recipient: the id of the recipient,
    *               created_at: the time of creation of the message,
    *               updated_at: the time of the last modification of the message
    * 	       }
    * 	     ], {...}, ...
    * 	  }, {...}, ...
    * 	]
    * }
    */
    app.get('/api/message', auth, MessageController.index);
};
