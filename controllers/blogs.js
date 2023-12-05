const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// ROUTE TO GET ALL BLOGS
blogsRouter.get('/', (request, response) => {

  console.log("GET ALL")

    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
  })

  // ROUTE TO GET 1 BLOG
  blogsRouter.get('/:id', async (request, response) => {
    console.log("GET 1 BLOG")

    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  })

  // ROUTE TO POST A BLOG
  blogsRouter.post('/', (request, response) => {
    console.log("POST A NEW BLOG")

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

    // ROUTE TO DELETE A BLOG
    blogsRouter.delete('/:id', async (request, response) => {
      console.log("DELETE A BLOG")

        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
    })


    // ROUTE TO UPDATE A BLOG
    blogsRouter.put('/:id', async (request, response) => {
      try{
        console.log(request.params.id)

      let blogData = request.body

      const blog = {
        title: blogData.title,
        author: blogData.author,
        url: blogData.url,
        likes: blogData.likes
      }

      let updatedBlog = await Blog.findOneAndUpdate({_id: request.params.id}, blog, {new:true})

      if (!updatedBlog) {
        return response.status(404).json({ error: 'Blog not found' });
      }

      response.json(updatedBlog)

      }

      catch(error){
        console.error(error)
        response.status(500).json({ error: 'Internal server error' })
      }
    })

  module.exports = blogsRouter