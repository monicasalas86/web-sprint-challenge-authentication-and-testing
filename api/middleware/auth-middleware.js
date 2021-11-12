const Users = require('../users/users-model')

const checkBody = (req, res, next) => {
  const {username, password} = req.body

  if(
    !username ||
    username.trim() === '' ||
    typeof username !== "string" ||
    !password
  ) {
    return next({
      status: 400,
      message: 'username and password required'
    })
  }
  next()
}

const checkUsernameFree = async (req, res, next) => {
  try {
    const {username} = req.body
    const existingUsername = await Users.findBy({username}).first()

    if(existingUsername) {
      next({
        status: 422,
        message: 'username taken'
      })
    } else {
      next()
    }
  } catch (error) {
    next(error)
  }
}

const checkExistingUsername = async (req, res, next) => {
  try {
    const {username} = req.body
    const existingUsername = await Users.findBy({username}).first()

    if(!existingUsername) {
      next({
        status: 401,
        message: 'invalid credentials'
      })
    } else {
      req.user = existingUsername
      next()
    }
  } catch (error) {
    next(error)
  }
}

module.exports = {
  checkBody,
  checkUsernameFree,
  checkExistingUsername
}
