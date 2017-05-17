module.exports = function(mongoose) {
    var bcrypt = require('bcrypt-nodejs');
    var Schema = mongoose.Schema;

    var userSchema = new Schema({
        username   : { type : String, required : true, unique : true },
        password   : { type : String, required : true },
        online     : { type : Boolean, default : false },
        created_at : Date,
        updated_at : Date
    });

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

    userSchema.methods.validPassword = function(password) {
        return bcrypt.compareSync(password, this.password);
    };

    module.exports.User = mongoose.model('User', userSchema);
};
