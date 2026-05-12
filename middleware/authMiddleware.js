const isAuthenticated = (req, res, next) => {
  console.log('isAuthenticated - Session user:', req.session.user);
  
  // Check if user exists in session
  if (req.session && req.session.user) {
    // Attach user to req object for controllers
    req.user = req.session.user;
    console.log('User authenticated, ID:', req.user.id);
    return next();
  }
  
  console.log('No user in session, redirecting to login');
  req.session.error = 'Please login to book tickets';
  res.redirect("/auth/login");
};

const isAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === "admin") {
    req.user = req.session.user;
    return next();
  }
  res.status(403).send("Access Denied: No access to view or modify events");
};

module.exports = {
  isAuthenticated,
  isAdmin,
};