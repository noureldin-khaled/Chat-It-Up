/**
*  User
*  @property {String} username: The user's username
*  @property {String} password: The user's password
*  @property {Boolean} online: if the user is currently online or not (true, false)
*  @property {Date} created_at: The user's creation time
*  @property {Date} updated_at: The time the user was last modified
*/

/**
 * This function is responsible for creating the User model.
 * @param  {Object} mongoose The Mongoose instance
 */
module.exports = function(mongoose) {
    var bcrypt = require('bcrypt-nodejs');
    var Schema = mongoose.Schema;

    /* create user schema */
    var userSchema = new Schema({
        username   : { type : String, required : true, unique : true },
        password   : { type : String, required : true },
        online     : { type : Boolean, default : false },
        created_at : Date,
        updated_at : Date
    });

    /* hash password before storing the user, as well as update created_at and updated_at fields */
    userSchema.pre('save', function(next) {
        var currentDate = new Date();

        this.updated_at = currentDate;

        if (!this.created_at) {
            this.created_at = currentDate;
        }

        if (!this.isModified('password')) return next();

        this.password = bcrypt.hashSync(this.password);
        next();
    });

    /*
        A function to validate that the provided password is correct
     */
    userSchema.methods.validPassword = function(password) {
        return bcrypt.compareSync(password, this.password);
    };

    module.exports.User = mongoose.model('User', userSchema);
};
