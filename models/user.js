var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    email: String,
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "School"
    },
    cluborgs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cluborg"
        }
    ],
    isFaculty: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    join_date: {type: Date, default: Date.now}
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);