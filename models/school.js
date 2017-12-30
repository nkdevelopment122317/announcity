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
}, { usePushEach: true });

//DO NOT PLUGIN PASSPORT TO THIS SCHEMA. THAT CAUSED THE DUPLICATE KEY ERROR!!!!!!!

module.exports = mongoose.model("School", schoolSchema);