require('dotenv').config();
const link = process.env.DB_URL;

// FOR LOCAL TESTING
//const link = "mongodb://localhost:27017/Unbound"

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser')
const ejs = require('ejs-async');
const cors = require('cors');
//const MongoStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const MongoStore = require('connect-mongodb-session')(session, mongoose);
//const MongoStore = require('connect-mongo');
//const MongoStore = require('express-mongoose-store')(session, mongoose);
const router = express.Router();

const routesRegister = require('./routers/routesRegister');
const routesLogin = require('./routers/routesLogin');
const routesUser = require('./routers/routesUser');
const routesSidebar = require('./routers/routesSidebar');
const routesSavings = require('./routers/routesSavings');
const routesForms = require('./routers/routesForms');
const routesPart = require('./routers/routesPart');

const { isLoggedInMiddleware } = require('./lib/middleware');
const { userIDMiddleware } = require('./lib/middleware');
const { rememberMeMiddleware } = require('./lib/middleware');
const { sidebarMiddleware } = require('./lib/middleware');
const { hashPassword } = require('./lib/hashing');

//const Loan = require('../models/Loan')
const Member = require('./models/Member');
const Part = require('./models/Part');
const Saving = require('./models/Saving');
const User = require('./models/User');

const Cluster = require('./models/Cluster');
const Project = require('./models/Project');
const Group = require('./models/Group');

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
  databaseName: 'Unbound',
  collection: 'sessions',
  ttl: 21*24*60*60,
  autoRemove: 'native',
});

app.use(session({
  key: 'user._id',
  secret: process.env.SesSECRET,
  resave: false,
  saveUninitialized: false,
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

app.get("/", async (req, res) => {
  try {
    if(req.session.isLoggedIn){
      res.redirect("/dashboard");
    }else{
      res.render("login");
    }
  } catch (error) {
    console.error(error);
    //res.status(500).render("fail", { error: "An error occurred." });
    res.status(500);
  }
});

app.get("/cluster",  (req, res) => { 
  res.redirect("/cluster/1");
})

// app.get("/project",  (req, res) => { 
//   res.redirect("/project");
// })

// app.get("/group",  (req, res) => { 
//   res.redirect("/group");
// })

// app.get("/savings",  (req, res) => { 
//   res.redirect("/savings");
// })

// app.get("/member",  (req, res) => { 
//   res.redirect("/member");
// })

// app.get("/registration",  (req, res) => { 
//   res.redirect("/registration");
// })

// app.get("/profile",  (req, res) => { 
//   res.redirect("/profile");
// })

// app.get('*', function(req, res){
//   res.redirect('/dashboard');
// });

// app.get("/register", (req, res)=>{
//   if(req.session.isLoggedIn){
//     req.session.cachedNoUpdate = false;
//     res.redirect("/dashboard");
//   }else{
//   return res.render("register", {error: null})
//   }
//   res.render("register", {error: null})
// })

// app.get("/success", (req, res)=>{
//   res.render("success")
// })

// app.get("/login", (req, res)=>{
//   if(req.session.isLoggedIn){
//     req.session.cachedNoUpdate = false;
//     console.log(req.expires);
//     res.redirect("/dashboard");
//   }else{
//   return res.render("login")
//   }
//   res.render("login");
// })

// app.get("/logout", async(req, res)=>{
//   await req.session.destroy();
//   console.log("not logged in");
//   res.render("logout")
// })

// app.get("/success", (req, res) => {
//   res.render("success");
// });

app.use(isLoggedInMiddleware);
app.use(userIDMiddleware);
app.use(rememberMeMiddleware);
app.use(sidebarMiddleware);

app.use(express.urlencoded({ extended: true }));
app.use(routesRegister);
app.use(routesLogin);
app.use(routesUser);
app.use(routesSidebar);
app.use(routesSavings);
app.use(routesForms);
app.use(routesPart);