const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// ROUTE TO GET ALL BLOGS
blogsRouter.get('/', (request, response) => {
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
  })
  
  // ROUTE TO POST A BLOG
  blogsRouter.post('/', (request, response) => {
    const blog = new Blog(request.body)
  
    blog
      .save()
      .then(result => {
        response.status(201).json(result)
      })
  })

  module.exports = blogsRouter