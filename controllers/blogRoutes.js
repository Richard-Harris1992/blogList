const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const User = require('../models/User');
const { userExtractor } = require('../utils/middleware');




router.get('/', async (request, response) => {
     const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
     response.json(blogs) 
  });
  
  router.post('/', userExtractor, async (request, response, next) => {
  
    const body = request.body;
    try{     
      const user = request.user;
      console.log(user)

      const blog = new Blog({
        title: body.title,
        author: user.name,
        url: body.url,
        likes: 0,
        user: user.id
      });
      
      const savedBlog = await blog.save();
      user.blogs = user.blogs.concat(savedBlog.id);
      await user.save();
    
      response.status(201).json(savedBlog);
        
    } catch(error) {
      next(error);
    } 
  });

  router.put('/:id', async (request, response, next) => {
    try {  
      const updateBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, {new: true});
      response.json(updateBlog);
    } catch(error) {
      next(error)
    }
  });

  router.delete('/:id', userExtractor, async (request, response, next) => { //where :id represents the blog id
    try{
      const singleBlog = await Blog.findById(request.params.id);
  
      if(singleBlog.user.toString() === request.user.id) {
        await singleBlog.remove();
        response.json(singleBlog);
      } else {
        throw new Error('DeleteError');
      }
    } catch(error) {
      next(error);
    }
  });

  module.exports = router;