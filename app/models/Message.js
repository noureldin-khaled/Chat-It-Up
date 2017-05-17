module.exports = function(mongoose) {
    var Schema = mongoose.Schema;

    var messageSchema = new Schema({
        content    : { type : String, required           : true },
        seen       : { type : Boolean, default           : false },
        sender     : { type : Schema.Types.ObjectId, ref : 'User' },
        recipient  : { type : Schema.Types.ObjectId, ref : 'User' },
        created_at : Date,
        updated_at : Date
    });

    messageSchema.pre('save', function(next) {
        var currentDate = new Date();

        this.updated_at = currentDate;

        if (!this.created_at) {
            this.created_at = currentDate;
        }

        next();
    });

    module.exports.Message = mongoose.model('Message', messageSchema);
};
