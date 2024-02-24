var express = require('express');
const passport = require("passport")
var router = express.Router();
const postModel = require('./post');
const userModel = require('./user');
const localStrategy = require("passport-local")

passport.authenticate(new localStrategy(userModel.authenticate()));

router.get('/profile', isLoggedIn, function(req, res, next) {
  res.send('profile');
});

router.get('/', function(req, res) {
  res.render('index');
});
router.post("/register", function(req, res) {
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname });

  userModel.register(userData, req.body.password)
    .then(function() {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/profile");
      });
    })
  })
//     .catch(err => {
//       console.error('Registration error:', err);

//       if (err.name === 'UserExistsError') {
//         // Handle case where username or email already exists
//         res.status(400).send('Username or email already exists.');
//       } else {
//         // Handle other registration errors
//         res.status(500).send('Internal server error.');
//       }
//     });
// });

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/"
}));

router.get("/logout", function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
}

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
