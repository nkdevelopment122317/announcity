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
<<<<<<< HEAD
        }
=======
        }    
>>>>>>> 3c25aa06352e79df03106ce3109c4a82004ed4c2
   ],
   announcements: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Announcement"
        }
   ],
   date_created: {type: Date, default: Date.now}
<<<<<<< HEAD
}, { usePushEach: true });
=======
});
>>>>>>> 3c25aa06352e79df03106ce3109c4a82004ed4c2

//DO NOT PLUGIN PASSPORT TO THIS SCHEMA. THAT CAUSED THE DUPLICATE KEY ERROR!!!!!!!

module.exports = mongoose.model("Cluborg", cluborgSchema);