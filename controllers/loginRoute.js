const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../utils/config');

router.post('/', async (request, response, next) => {
  try{  
    const { username, password } = request.body;
    const user = await User.findOne({ username });
    const validPassword = user === null
        ? false
        : await bcrypt.compare(password , user.passwordHash);

    if(!(user && validPassword)) {
      return response.status(401).json({
        error: 'invalid username or password'
      });
    }
    const userForToken = {
      username : user.username,
      id : user.id
    }

    const token = jwt.sign(
      userForToken, 
      config.SECRET, 
      { expiresIn: 60*60 });
    
    response
    .status(200)
    .send({ token, username: user.username, name: user.name })
    
  } catch(error) {
    next(error);
  }
});

module.exports = router;