var mongoose = require('mongoose');

module.exports.connect = function(callback) {
    mongoose.connect(process.env.DB_URL, function(err) {
        if (err) {
            callback(err);
        }
        else {
            require('../models/User')(mongoose);
            require('../models/Message')(mongoose);

            callback();
        }
    });
};
