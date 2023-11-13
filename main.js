require('dotenv').config();
const link = process.env.DB_URL;

// FOR LOCAL TESTING
//const link = "mongodb://localhost:27017/Unbound"

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser')
const ejs = require('ejs-async');
const cors = require('cors');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongodb-session')(session, mongoose);
const router = express.Router();

const routesRegister = require('./routers/routesRegister');
const routesLogin = require('./routers/routesLogin');
const routesProfile = require('./routers/routesProfile');
const routesSidebar = require('./routers/routesSidebar');
const routesSavings = require('./routers/routesSavings');
const routesCluster = require('./routers/routesCluster');
const routesProject = require('./routers/routesProject');
const routesGroup = require('./routers/routesGroup');
const routesMember = require('./routers/routesMember');
const routesChoices = require('./routers/routesChoices');

const { isLoggedInMiddleware } = require('./lib/middleware');
const { userIDMiddleware } = require('./lib/middleware');
const { rememberMeMiddleware } = require('./lib/middleware');
const { sidebarMiddleware } = require('./lib/middleware');
const { clusteridMiddleware } = require('./lib/middleware');
const { projectidMiddleware } = require('./lib/middleware');
const { groupidMiddleware } = require('./lib/middleware');
const { memberidMiddleware } = require('./lib/middleware');
const { savingidMiddleware } = require('./lib/middleware');
const { authorityMiddleware } = require('./lib/middleware');
const Member = require('./models/Member');
const Saving = require('./models/Saving');
const User = require('./models/User');
const Cluster = require('./models/Cluster');
const Project = require('./models/Project');
const Group = require('./models/Group');

const app = express();
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
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
  ttl: 21 * 24 * 60 * 60,
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
  .then(() => console.log('Connected to server!'))
  .catch((error) => console.error('Connection error:', error));

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Listening to Port ${port}`)
});

app.get("/", async (req, res) => {
  try {
    if (req.session.isLoggedIn) {
      res.redirect("/dashboard");
    } else {
      res.render("login");
    }
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

app.get("/manual", async (req, res) => {
  try {
    req.session.destroy();
    res.json();
} catch (err) {
    console.error('Error logging out:', err);
    return new Error('Error logging out');
}
res.status(200).send();
});

app.get("/cluster", (req, res) => {
  res.redirect("/cluster/view/1");
})

app.get("/project", (req, res) => {
  res.redirect("/project/view/1");
})

app.get("/group", (req, res) => {
  res.redirect("/group/view/1");
});

//This is one just to render the forms in a separate page
router.get("/addUser", async (req, res) => {
  if (req.session.isLoggedIn) {
      const user = await User.findById(req.session.userId);
      const authority = user.authority;
      var clusters = []; // sample
      if (authority == "Admin") {
          clusters = await Cluster.find({});
      }
      if (authority == "SEDO") {
          clusters = await Cluster.find({ validSEDOs: [user] });
      }
      res.render("popup", { authority, clusters });
  }
  else
      res.redirect("/");
});

app.use(isLoggedInMiddleware);
app.use(userIDMiddleware);
app.use(rememberMeMiddleware);
app.use(sidebarMiddleware);
app.use(clusteridMiddleware);
app.use(projectidMiddleware);
app.use(groupidMiddleware);
app.use(memberidMiddleware);
app.use(savingidMiddleware);
app.use(authorityMiddleware);

app.use(express.urlencoded({ extended: true }));
app.use(routesRegister);
app.use(routesLogin);
app.use(routesProfile);
app.use(routesSidebar);
app.use(routesSavings);
app.use(routesCluster);
app.use(routesProject);
app.use(routesGroup);
app.use(routesMember);
app.use(routesChoices);