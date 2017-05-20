module.exports = function(app) {
    var AuthController = require('../controllers/AuthController');
    var auth = require('../middlewares/AuthMiddleware');

    /**
    * A POST route responsible for user registration.
    * @var /api/register POST
    * @name /api/register POST
    * @example The route expects a body Object in the following format
    * {
    *   username: String, [required]
    *   password: String [required]
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
    * 	     msg: the type of error that was caused ['required', 'unique violation']
    * 	  }, {...}, ...
    * 	]
    *  }
    */
    app.post('/api/register', AuthController.register);

    /**
    * A POST route responsible for logging in an existing user.
    * @var /api/login POST
    * @name /api/login POST
    * @example The route expects a body Object in the following format
    * {
    *   username: String, [required]
    *   password: String [required]
    * }
    * @example The route returns as a response an object in the following format
    * {
    * 	status: Succeeded/Failed,
    * 	message: String showing a descriptive text,
    * 	user:
    * 	{
    * 	 _id: user's id in the database,
    * 	 username: user's username,
    * 	 token: an authentication token
    * 	},
    * 	errors:
    * 	[
    * 	  {
    * 	     param: the field that caused the error,
    * 	     value: the value that was provided for that field,
    * 	     msg: the type of error that was caused ['required']
    * 	  }, {...}, ...
    * 	]
    *  }
    */
    app.post('/api/login', AuthController.login);

    /**
    * A PUT route responsible for logging in a user with an auth token only.
    * @var /api/login PUT
    * @name /api/login PUT
    * @example the route expects the access token as 'Authorization' in the request headers
    * @example The route returns as a response an object in the following format
    * {
    * 	status: Succeeded/Failed,
    * 	message: String showing a descriptive text
    * }
    */
    app.put('/api/login', auth, AuthController.cacheLogin);

    /**
    * A GET route responsible for logging out an existing user.
    * @var /api/logout GET
    * @name /api/logout GET
    * @example the route expects the access token as 'Authorization' in the request headers
    * @example The route returns as a response an object in the following format
    * {
    * 	status: Succeeded/Failed,
    * 	message: String showing a descriptive text
    * }
    */
    app.get('/api/logout', auth, AuthController.logout);
};
