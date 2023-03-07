const logger = require('./logger');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const config = require('../utils/config');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
      })
  } else if (error.name === 'DeleteError') {
    return response.status(400).json({error: 'could not delete blog'})
  } else if(error.name === 'Error'){
    return response.status(400).json({error: 'cannot delete blog'})
  }
  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const logStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' })

morgan.token('json', (req) => {
  return JSON.stringify(req.body)
})

const morganLogger = morgan(':method :url :status :res[content-length] - :response-time ms :json', { stream: logStream });



const tokenExtractor = (request, response, next) => {
  const authorization = request.get('Authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7);
  } else {
    request.token = null;
  }
  next();
};

const userExtractor = async (request, response, next) => {
  try{

 
    const decodedToken = jwt.verify(request.token, config.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    } else {
      const user = await User.findById(decodedToken.id);
      request.user = user;
    }
  } catch(error) {
    next(error);
  }
      next();
};

module.exports = { requestLogger, errorHandler, unknownEndpoint, morganLogger, tokenExtractor, userExtractor }

