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
<<<<<<< HEAD
}, { usePushEach: true });
=======
});
>>>>>>> 3c25aa06352e79df03106ce3109c4a82004ed4c2

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);