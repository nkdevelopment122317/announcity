var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var schoolSchema = new mongoose.Schema({
    members: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        }
    ],
    clubs: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "cluborg"
            }
        }
    ],
    school_code: Number,
    date_joined: {type: Date, default: Date.now}
});

schoolSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("School", schoolSchema);