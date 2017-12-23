var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    school: String,
    clubs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Club"
        }
    ],
    type: String,
    join_date: {type: Date, default: Date.now}
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);