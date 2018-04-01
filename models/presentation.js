var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var presentationSchema = new mongoose.Schema({
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    date: {type: Date, default: Date.now},
    name: String,
    description: String,
    image: String,
    favorite: {
        type: Boolean,
        default: false
    }
}, { usePushEach: true });

module.exports = mongoose.model("Presentation", presentationSchema);