var express = require('express');
const passport = require("passport")
var router = express.Router();
const postModel = require('./post');
const userModel = require('./user');
const localStrategy = require("passport-local");
const upload=require('./multer')

passport.use(new localStrategy(userModel.authenticate()));


// router.get('/prof', function(req, res, next) {
//   res.render('prof');
// });
router.get('/feed', function(req, res, next) {
  res.render('feed');
});

router.post('/upload',isLoggedIn,upload.single('file'), async function(req, res,next){
  if(!req.file){
    return res.status(400).send('No files were uploaded');
  }
  // res.send('File uploaded successfully:...')
  const user=await userModel.find({

    username:req.session.passport.user});
    const post=await postModel.create({
      image:req.file.filename,
      imageText:req.body.filecaption,
      user:user._id
    });
    user.post.push(post._id)
    await user.save();
    res.send("done")

});



router.get('/', function(req, res) {
  res.render('index');
});
router.get('/profile', function(req, res,next) {
  res.render('profile');
});
router.get('/login',function(req,res,next){
  // console.log(req.flash("error"))
  res.render("login",{error:req.flash('error')})
});
router.get('/profile',isLoggedIn, async function(req, res, next) {
  try {
    const user = await userModel.findOne({
      username: req.session.passport.user
    });
    console.log(user);
    res.render('profile', { user });
    
  } catch (error) {
    console.error('Error fetching user:', error);
    next(error); // Pass the error to the next middleware
  }
  
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
    .catch(err => {
      console.error('Registration error:', err);

      if (err.name === 'UserExistsError') {
        // Handle case where username or email already exists
        res.status(400).send('Username or email already exists.');
      } else {
        // Handle other registration errors
        res.status(500).send('Internal server error.');
      }
    });
});

    
// });

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash:true
}));
function isLoggedIn(req, res,next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("error", "You need to be logged in to access this page.");
    res.redirect("/login");
  }
}


router.get("/logout", function(req, res,next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});



// function isLoggedIn(req, res, next) {
//   if (req.isAuthenticated()) return next();
//   res.redirect("/login");
// }



// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

module.exports = router;
