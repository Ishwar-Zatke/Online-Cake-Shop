require('dotenv').config()
const express = require("express");
const path = require('path')
const ejs = require('ejs')
const expresslayout= require('express-ejs-layouts');
//Return main object of epress functionality
const app = express();
const PORT = process.env.PORT || 3000
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore =   require('connect-mongo');
const passport = require('passport')


//Database Creation
const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/cupcake';
mongoose.connect(url);//, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true});
const connection = mongoose.connection; 
connection.once('open', ()=>{
    console.log("Database connected...");

}).catch(err => {
    console.log("Connection failed...");
});

//Session store
let mongoStore =  MongoDbStore.create({
    // mongoUrl: 'mongodb+srv://<id+ password>@cluster0.cq7f2.mongodb.net/DBname?retryWrites=true&w=majority',
    // mongooseConnection: connection,
    mongoUrl: 'mongodb://localhost:27017/cupcake',
    collection: 'sessions'
 })

app.use(session({
    secret: process.env.COOKIE_SECRET, //for cookies encryption
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000*60*60*24 } //Cookie life-24hrs
}))

//Passport config
const passportInit = require('./app/config/passport');

passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())


app.use(flash())
//Assets
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false}))
app.use(express.json())

//Global Middleware
app.use((req, res,next)=>{
    //3 things-req,res,next which is callback
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

//Set template engine
app.use(expresslayout)
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')

//All routes after template engine since layout.ejs ka chochla
require('./routes/web')(app);




const server = app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`);
})
