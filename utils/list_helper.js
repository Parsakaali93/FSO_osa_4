const dummy = (blogs) => {
    return 1
  }
  
const totalLikes = (blogs) => {
    let tally = 0
    blogs.forEach((blog) => tally += blog.likes)
    return tally
}

  module.exports = {
    dummy, totalLikes
  }