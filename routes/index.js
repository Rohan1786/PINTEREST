var express = require('express');
var router = express.Router();
const postModel=require('./post');
const userModel=require('./user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/createUser', async function(req, res, next) {
 let createdUser=await userModel.create({
  username:"rohan",
  password:"rohan",
  posts: [],
  email:"rohan@gmail.com",
  fullname: "rohan pawar"
 })
 res.send(createdUser)
});

 router.get('/createpost', async function(req, res, next) {
 let createdPost=await postModel.create({
    postText:"hello every one"
  
  })
  res.send(createdPost)
  });
  

module.exports = router;
