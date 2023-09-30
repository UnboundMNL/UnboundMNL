
const isLoggedInMiddleware = (req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn || false;
    next();
  };

const userIDMiddleware = (req, res, next) => {
    res.locals.userID = req.session.userId;
    res.locals.userId = req.session.userId;
    next();
  };

const rememberMeMiddleware= (req, res, next) => {
    res.locals.rememberMe = req.session.rememberMe || false;
    next();
  }
module.exports = {
  isLoggedInMiddleware,
  userIDMiddleware,
  rememberMeMiddleware
};




  