const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const { sanitizeFilter } = require('mongoose')

const jwt = require('jsonwebtoken')

const getTokenFrom = request => {  
  const authorization = request.get('authorization')

  if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '')
        }  

  return null
}

// Get users
usersRouter.get('/', async(request, response) => {
    const users = await User.find({})
    response.json(users)
}
)

// Add new user
usersRouter.post('/', async(request, response) => {
    const {username, password} = request.body

    const salt = 10
    const passwordHash = await bcrypt.hash(password, salt)

    const user = new User({
        username,
        passwordHash,
      })
    
      const savedUser = await user.save()
      
      response.status(201).json(savedUser)
}
)

// Route to get all blogs belonging to a single user
usersRouter.get('/blogs', async (req, res) => {
    console.log("gets here")
    console.log(req.header)
    const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
    
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })  
    }
  
    try {
      // Find the user by ID and populate the 'blogs' array with blog documents
      const user = await User.findById(decodedToken.id).populate('blogs');
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Access the blogs belonging to the user
      const userBlogs = user.blogs;
      res.json(userBlogs);
    } 
    
    catch (error) {
      console.error('Error fetching user blogs:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = usersRouter