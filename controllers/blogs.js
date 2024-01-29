const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {  
  const authorization = request.get('authorization')

  if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '')
        }  

  return null
}

// ROUTE TO GET ALL BLOGS
blogsRouter.get('/', (request, response) => {

  console.log("GET ALL")

    Blog
      .find({ }).populate('user', {username: 1})
      .then(blogs => {
        response.json(blogs)
      })
  })

  // blogsRouter.get('/user', (request, response) => {
  //   console.log("GET ALL FOR USER")
  //   console.log(request.headers)
  //   const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  //   console.log(decodedToken)
  //     Blog
  //       .find({ user:decodedToken.id }).populate('user', {username: 1})
  //       .then(blogs => {
  //         response.json(blogs)
  //       })
  //   })


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
  blogsRouter.post('/', async (request, response) => {
    console.log("POST A NEW BLOG")

    let blogData = request.body

    // 4. Client stores that token and sends it along with every request
    // 5. Server verifies token and responds with data

    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })  
    }

    if(!blogData.hasOwnProperty('likes')){
      blogData = {...blogData, likes: 0}
    }
    
    let user = await User.findById(decodedToken.id)
    blogData.user = user._id

    const blog = new Blog(blogData)

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)

    }
  )

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

      console.log('Blog to update: ', request.body)

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