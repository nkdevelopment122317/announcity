var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var cluborgSchema = new mongoose.Schema({
   members: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        }    
   ],
   announcements: [
        {
            id: {
                type: mongoose.Schema.Types.Id,
                ref: "Announcement"
            }
        }
   ],
   date_created: {type: Date, default: Date.now}
});

cluborgSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Cluborg", cluborgSchema);