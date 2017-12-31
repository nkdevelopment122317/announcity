var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('./models/user');
var methodOverride = require('method-override');
var flash = require('connect-flash');

var announcementRoutes = require('./routes/announcements');
var cluborgRoutes = require('./routes/cluborgs');
var indexRoutes = require('./routes/index');
var schoolRoutes = require("./routes/schools");

mongoose.Promise = global.Promise;
var databaseUri = "mongodb://localhost/announcity";
mongoose.connect(databaseUri, {useMongoClient: true})
        .then(() => console.log(`Database connected at ${databaseUri}`))
        .catch(err => console.log(`Database connection error: ${err.message}`));

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIGURATION
app.use(require('express-session')({
    secret: "I always loved playing the harmonica.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/schools", schoolRoutes);
app.use("/schools/:id/cluborgs", cluborgRoutes);
app.use("/schools/:id/cluborgs/:club_id/announcements", announcementRoutes); //:id is the school

// app.listen(process.env.PORT, process.env.IP, function() {
//     console.log("Announcity Server has started");
// });

app.listen(3000);