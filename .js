//TODO: Add the rest of get and renders.

require('dotenv').config();
const link = process.env.DB_URL;
const routesRegister = require('./routers/routesRegister');
const routesLogin = require('./routers/routesLogin');
const routesUser = require('./routers/routesUser');


const { isLoggedInMiddleware } = require('./lib/middleware');
const { userIDMiddleware } = require('./lib/middleware');
const { rememberMeMiddleware } = require('./lib/middleware');
const { hashPassword } = require('./lib/hashing');


const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser')
const ejs = require('ejs-async');
const cors = require('cors');
const he = require("he");
//const MongoStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const MongoStore = require('connect-mongodb-session')(session, mongoose);
//const MongoStore = require('connect-mongo');
//const MongoStore = require('express-mongoose-store')(session, mongoose);
const cheerio = require('cheerio');
const router = express.Router();

const app = express();

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const store = new MongoStore({
  uri: link,
  databaseName: 'SnaccOverflow',
  collection: 'sessions',
  ttl: 21*24*60*60,
  autoRemove: 'native',
});

app.use(session({
  key: 'user._id',
  secret: process.env.SesSECRET,
  resave: false,
  saveUninitialized: true,
  rolling: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 21,
  },
  store: store,
}));
const methodOverride = require('method-override');
app.use(methodOverride('_method'));


mongoose.connect(link)
    .then(()=>console.log('Connected to server!'))
    .catch((error) => console.error('Connection error:', error));
const port = process.env.PORT 
app.listen(port, ()=>{
  console.log(`Listening to Port ${port}`)
});

//const Loan = require('../models/Loan')
const Member = require('../models/Member');
const Part = require('../models/Part');
const Saving = require('../models/Saving');
const User = require('../models/User');

app.use(isLoggedInMiddleware);
app.use(userIDMiddleware);
app.use(rememberMeMiddleware);



app.get("/", async (req, res) => {
  try {
    res.render("/", { params });
  } catch (error) {
    console.error(error);
    res.status(500).render("fail", { error: "An error occurred." });
  }
});

// app.get("/", (req, res)=>{
//   res.redirect("/")
// })

app.get("/", (req, res)=>{
    res.render("/")
})

app.get("/register", (req, res)=>{
  if(req.session.isLoggedIn){
    req.session.cachedNoUpdate = false;
    res.redirect("/dashboard");
  }else{
  return res.render("register", {error: null})
  }
  res.render("register", {error: null})
})

app.get("/success", (req, res)=>{
  res.render("success")
})

app.get("/login", (req, res)=>{
  if(req.session.isLoggedIn){
    req.session.cachedNoUpdate = false;
    console.log(req.expires);
    res.redirect("/dashboard");
  }else{
  return res.render("login")
  }
  res.render("login");
})

app.get("/logout", async(req, res)=>{
  await req.session.destroy();
  console.log("not logged in");
  res.render("logout")
})

app.get("/success", (req, res) => {
  res.render("success");
});


app.use(express.urlencoded({ extended: true }));
app.use(routesUserRegisterAndLogin);
app.use(routesUser);
app.use(routesPost);
app.use(routesComment);
app.use(routesReact);
app.use(routesSearch);


