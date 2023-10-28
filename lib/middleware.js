
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

const sidebarMiddleware= (req, res, next) => {
   res.locals.sidebar = req.session.sidebar || false;
   next();
}

const idMiddleware = (req, res, next) => {
    res.locals.redirect = req.session.redirect;
    next();
}

const clusteridMiddleware = (req, res, next) => {
  res.locals.clusterId = req.session.clusterId || null;
  next();
}

const projectidMiddleware = (req, res, next) => {
  res.locals.projectId = req.session.projectId || null;
  next();
}

const groupidMiddleware = (req, res, next) => {
  res.locals.groupId = req.session.groupId || null;
  next();
}

const memberidMiddleware = (req, res, next) => {
  res.locals.memberId = req.session.memberId || null;
  next();
}

const savingidMiddleware = (req, res, next) => {
  res.locals.savingId = req.session.savingId || null;
  next();
}

// const loanidMiddleware = (req, res, next) => {
//   res.locals.loanId = req.session.loanId || null;
//   next();
// }



module.exports = {
  isLoggedInMiddleware,
  userIDMiddleware,
  rememberMeMiddleware,
  sidebarMiddleware,
  idMiddleware,
  clusteridMiddleware,
  projectidMiddleware,
  groupidMiddleware,
  memberidMiddleware,
  savingidMiddleware,
  // loanidMiddleware
};




  