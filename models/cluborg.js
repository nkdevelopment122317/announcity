var mongoose = require('mongoose');

var cluborgSchema = new mongoose.Schema({
   name: String,
   description: String,
   image: String,
   school: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "School"
   },
   author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
   },
   members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }    
   ],
   announcements: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Announcement"
        }
   ],
   date_created: {type: Date, default: Date.now}
});

//DO NOT PLUGIN PASSPORT TO THIS SCHEMA. THAT CAUSED THE DUPLICATE KEY ERROR!!!!!!!

module.exports = mongoose.model("Cluborg", cluborgSchema);