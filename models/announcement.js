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
    school: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "School"
    },
    date: {type: Date, default: Date.now},
    title: String,
    text: String,
    cluborg: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cluborg"
        },
        name: String
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    scheduledDate: {type: Date, default: Date.now},
    state: {type: String, default: "Normal"}
});

//DO NOT PLUGIN PASSPORT TO THIS SCHEMA. THAT CAUSED THE DUPLICATE KEY ERROR!!!!!!!

module.exports = mongoose.model("Announcement", announcementSchema);