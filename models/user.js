var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    firstName: String,
    lastName: String,
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
    isSetup: {
        type: Boolean,
        default: false
    },
    isRegularUser:{
        type: Boolean,
        default: true
    },
    isFaculty: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    confirmationTolerance: { // a number indicating the number of times a user skips a confirmation for something
        type: Number,
        default: 0
    },
    announcements: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Announcement"
        }
    ],
    join_date: {type: Date, default: Date.now}
}, { usePushEach: true });

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);