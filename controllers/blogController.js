const Blog = require('../models/blogModel');
const {body , validationResult} = require('express-validator');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const authenticate = require('../middlewares/authenticate');


exports.demoMiddleware = (req,res,next) =>{
  console.log("middleware runs");
  next();
};


exports.getAllBlogs = async(req,res) =>{
  const blogs = await Blog.find();
  res.status(200).json({
    status:"success",
    blogs
  });
};

exports.createBlog = async (req,res) =>{
  const blog = await Blog.create({
    title:req.body.title,
    body:req.body.body,
    category:req.body.category
  });
  res.status(201).json({
       status:"success",
       blog
   });
}


exports.getSingleBlog = (req,res) =>{
  console.log(req.params.id);
  res.send("Getting single blog");
}


exports.updateSingleBlog = (req,res) =>{
  console.log(req.params.id);
  res.send("Updating single blog");
}

exports.deleteSingleBlog = (req,res) =>{
  console.log(req.params.id);
  res.send("deleting single blog");
}
exports.registerUser = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').notEmpty().withMessage('Email is required'),
  body('password').notEmpty().withMessage('Password is required'),
] , async (request , response) => {
  let errors = validationResult(request);
  if(!errors.isEmpty()){
      return response.status(401).json({errors : errors.array()})
  }
  try {
      let {name , email , password} = request.body;

      // check if user already exists or not
      let user = await User.findOne({email : email});
      if(user){
          return response.status(401).json({errors : [{msg : 'User is Already Exists'}]})
      }

      // encrypt the password
      let salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password , salt);

      // avatar url
      let avatar = gravatar.url(email , {
          s : '200',
          r : 'pg',
          d : 'mm'
      });

      let isAdmin = false;

      // save to db
      user = new User({name , email , password , avatar , isAdmin});
      user = await user.save();
      response.status(200).json({
          msg : 'Registration is success'
      });
  }
  catch (error) {
      console.error(error);
      response.status(500).json({
          errors : [
              { msg : error.message }
          ]
      });
  }
}


exports.loginUser = [
  body('email').notEmpty().withMessage('Email is required'),
  body('password').notEmpty().withMessage('Password is required'),
] , async (request , response) => {
  let errors = validationResult(request);
  if(!errors.isEmpty()){
      return response.status(401).json({errors : errors.array()})
  }
  try {
      let {email , password} = request.body;
      // check if user exists
      let user = await User.findOne({email : email});
      if(!user){
          return response.status(401).json({errors : [{msg : 'Invalid Credentials'}]});
      }
      // check the password
      let isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch){
          return response.status(401).json({errors : [{msg : 'Invalid Credentials'}]});
      }
      // create a JWT Token
      let payload = {
          user : {
              id : user.id,
              name : user.name
          }
      }
      jwt.sign(payload , process.env.JWT_SECRET_KEY , (err , token) => {
          if(err) throw err;
          response.status(200).json({
              msg : 'Login Success',
              token : token,
              user : user
          });
      });
  }
  catch (error) {
      console.error(error);
      response.status(500).json({
          errors : [
              { msg : error.message }
          ]
      });
  }
}
exports.getUser = authenticate , async (request , response) => {
  try {
      let user = await User.findOne({_id : request.user.id});
      response.status(200).json({user : user});
  }
  catch (error) {
      console.error(error);
      response.status(500).json({
          errors : [
              { msg : error.message }
          ]
      });
  }
}
