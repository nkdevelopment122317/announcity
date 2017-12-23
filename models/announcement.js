var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var announcementSchema = new mongoose.Schema({
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    date: {type: Date, default: Date.now},
    title: String,
    text: String,
    cluborg: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Club"
        }
    }
});

announcementSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Announcement", announcementSchema);