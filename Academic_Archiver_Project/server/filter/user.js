//  check  user status of login
function userLoginFilter(req, res, next) {
  var url = req.url;
  // if didnt login yet, user is not able to see personal data
  if (url != '/login' && !req.signedCookies.user && url != '/') {
    res.redirect('/login')
    return
  }
  //if did login, user can conncet to db
  next();
}

module.exports = userLoginFilter;