const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');



router.get('/', async (request, response, next) => {
  try{
    const users = await User
    .find({}).populate('blogs', {title: 1, author: 1, url: 1, likes: 1})
    response.json(users)
  } catch(error) {
    next(error);
  }
})

router.post('/', async (request, response, next) => {
  try{  
    const { username, name, password } = request.body;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      name,
      passwordHash     
    });

    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch(error) {
    next(error);
  }
});

module.exports = router;