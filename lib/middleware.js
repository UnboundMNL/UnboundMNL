
const isLoggedInMiddleware = (req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn || false;
  next();
};

const userIDMiddleware = (req, res, next) => {
  res.locals.userId = req.session.userId;
  next();
};

const rememberMeMiddleware = (req, res, next) => {
  res.locals.rememberMe = req.session.rememberMe || false;
  next();
}

const sidebarMiddleware = (req, res, next) => {
  res.locals.sidebar = req.session.sidebar || false;
  next();
}

const clusteridMiddleware = (req, res, next) => {
  res.locals.clusterId = req.session.clusterId;
  next();
}

const projectidMiddleware = (req, res, next) => {
  res.locals.projectId = req.session.projectId;
  next();
}

const groupidMiddleware = (req, res, next) => {
  res.locals.groupId = req.session.groupId;
  next();
}

const memberidMiddleware = (req, res, next) => {
  res.locals.memberId = req.session.memberId;
  next();
}

const savingidMiddleware = (req, res, next) => {
  res.locals.savingId = req.session.savingId;
  next();
}

const authorityMiddleware = (req, res, next) => {
  res.locals.authority = req.session.authority;
  next();
}

module.exports = {
  isLoggedInMiddleware,
  userIDMiddleware,
  rememberMeMiddleware,
  sidebarMiddleware,
  clusteridMiddleware,
  projectidMiddleware,
  groupidMiddleware,
  memberidMiddleware,
  savingidMiddleware,
  authorityMiddleware
};
