var mongoose = require('mongoose');

/**
 * This function connects to the database and initializes all models.
 */
module.exports.connect = function(callback) {
    mongoose.connect(process.env.DB_URL, function(err) {
        if (err) {
            callback(err);
        }
        else {
            /* initialize models */
            require('../models/User')(mongoose);
            require('../models/Message')(mongoose);

            callback();
        }
    });
};
