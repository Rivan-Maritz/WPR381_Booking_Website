const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next(); //The user is logged in, proceed to next function
  }
  res.redirect("/auth/login"); //The user is not logged in, redirect to login page
};

const isAdmin = (req, res, next) => {
  if (req.session && req.session.role === "admin") {
    return next(); //User is admin, proceed to next function
  }
  res.status(403).send("Access Denied: No access to view or modify events");
};

module.exports = {
  isAuthenticated,
  isAdmin,
};
