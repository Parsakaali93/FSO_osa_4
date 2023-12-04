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
    let blogData = request.body

    if(!blogData.hasOwnProperty('likes')){
      blogData = {...blogData, likes: 0}
    }

    const blog = new Blog(blogData)

    blog
      .save()
      .then(result => {
        response.status(201).json(result)
      })
  })

  module.exports = blogsRouter