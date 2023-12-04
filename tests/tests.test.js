const supertest = require('supertest')
const mongoose = require('mongoose')

const listHelper = require('../utils/list_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  //await Note.insertMany(helper.initialNotes)
})

test('get all blogs', async () => {
  const response = await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

    console.log(response.body)
})

test('blogs are identified by a field named id', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body

     blogs.forEach((blog) => {
      expect(blog.id).toBeDefined();
    });
})

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

test('blog with no likes has likes set to 0', async () => {
  const blogWithoutLikes = {
    id: '5a422aa71b54a676234d17f8',
    title: 'No Likey',
    author: 'Albert Eins',
    url: 'www.no.com',
    __v: 0
  }

  await api
  .post('/api/blogs')
  .send(blogWithoutLikes)
  .expect(201)
  .expect('Content-Type', /application\/json/)

  const b = await Blog.find({})
  const blogs = b.map(blog => blog.toJSON())

  expect(blogs[0].likes).toBe(0)
})

describe('total likes', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      }
    ]
  
    test('when list has only one blog equals the likes of that', () => {
      const result = listHelper.totalLikes(listWithOneBlog)
      expect(result).toBe(5)
    })
  })


  test('a blog can be added', async() => {

    const newBlog = {
        id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      }
  
      await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
      const b = await Blog.find({})
      const blogs = b.map(blog => blog.toJSON())
  
      expect(blogs).toHaveLength(1)
    
      const titles = blogs.map(n => n.title)
      expect(titles).toContain(
        'Go To Statement Considered Harmful'
      )
  })
  

  afterAll(async () => {
    await mongoose.connection.close()
  })