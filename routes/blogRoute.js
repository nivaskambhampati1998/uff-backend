const express = require('express');
const blogController = require('../controllers/blogController');

const router = express.Router();


router.route('/')
  .get(blogController.demoMiddleware,blogController.getAllBlogs)
  .post(blogController.createBlog);

router.route('/single/:id')
  .get(blogController.getSingleBlog)
  .patch(blogController.updateSingleBlog)
  .delete(blogController.deleteSingleBlog);

router.route('/register') 
  .post(blogController.registerUser);
router.route('/login')
  .post(blogController.loginUser);
router.get('/userinfo')
  .get(blogController.getUser)
module.exports = router;
