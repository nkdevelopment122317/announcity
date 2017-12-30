var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var schoolSchema = new mongoose.Schema({
    name: String,
    location: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    code: Number,
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    cluborgs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cluborg"
        }
    ],
    date_joined: {type: Date, default: Date.now}
<<<<<<< HEAD
}, { usePushEach: true });
=======
});
>>>>>>> 3c25aa06352e79df03106ce3109c4a82004ed4c2

//DO NOT PLUGIN PASSPORT TO THIS SCHEMA. THAT CAUSED THE DUPLICATE KEY ERROR!!!!!!!

module.exports = mongoose.model("School", schoolSchema);