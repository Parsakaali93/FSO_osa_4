const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {

  const { username, password } = request.body
console.log(request.body)
  const user = await User.findOne({ username })

  //2. Application validates credentials
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  /* Jos salasana on oikein, luodaan metodin jwt.sign avulla token,
   joka sisältää digitaalisesti allekirjoitetussa muodossa
   käyttäjätunnuksen ja käyttäjän id: */
  const token = jwt.sign(userForToken, process.env.SECRET)

  // 3. Application provides a signed token to the client
  response
    .status(200)
    .send({ token, username: user.username })
})

module.exports = loginRouter