/**
*  Message
*  @property {String} content: The message's content
*  @property {Boolean} seen: if the message is seen or not (true, false)
*  @property {ObjectId} sender: The sender of message
*  @property {ObjectId} recipient: The recipient of message
*  @property {Date} created_at: The message's creation time
*  @property {Date} updated_at: The time the message was last modified
*/

/**
 * This function is responsible for creating the Message model.
 * @param  {Object} mongoose The Mongoose instance
 */
module.exports = function(mongoose) {
    var Schema = mongoose.Schema;

    /* create message schema */
    var messageSchema = new Schema({
        content    : { type : String, required           : true },
        seen       : { type : Boolean, default           : false },
        sender     : { type : Schema.Types.ObjectId, ref : 'User' },
        recipient  : { type : Schema.Types.ObjectId, ref : 'User' },
        created_at : Date,
        updated_at : Date
    });

    /* update created_at and updated_at fields */
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
