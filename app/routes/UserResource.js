module.exports = function(app) {
    var UserController = require('../controllers/UserController');
    var auth = require('../middlewares/AuthMiddleware');

    /**
    * A GET route responsible for fetching all users from the database except the authenticated user.
    * @var /api/user GET
    * @name /api/user GET
    * @example the route expects the access token as 'Authorization' in the request headers
    * @example The route returns as a response an object in the following format
    * {
    * 	status: Succeeded/Failed,
    * 	message: String showing a descriptive text,
    * 	users:
    * 	[
    * 	  {
    * 	     _id: the user's id in the database,
    * 	     username: the user's username,
    * 	     online: if the user is currently online or not [true, false]
    * 	  }, {...}, ...
    * 	]
    *  }
    */
    app.get('/api/user', auth, UserController.index);

    /**
    * A PUT route responsible for updating the information of the authenticated user.
    * @var /api/user PUT
    * @name /api/user PUT
    * @example the route expects the access token as 'Authorization' in the request headers
    * @example The route expects a body Object in the following format
    * {
    *   old_password: String, [required]
    *   new_password: String [optional]
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
    * 	     msg: the type of error that was caused ['required', 'invalid']
    * 	  }, {...}, ...
    * 	]
    *  }
    */
    app.put('/api/user', auth, UserController.update);
};
