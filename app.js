const mongoose = require('mongoose');
const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
const express = require('express');
const app = express();
const cors = require('cors');
const blogRoutes = require('./controllers/blogRoutes');
const userRoutes = require('./controllers/userRoutes');
const loginRoute = require('./controllers/loginRoute');




mongoose.set('strictQuery', false);
try {
  mongoose.connect(config.MONGO_URI)
  logger.info('Connected to MongoDB');
} catch (error) {
  logger.error('Error connecting to MongoDB:', error.message);
}

app.use(cors());
app.use(express.json());
app.use(express.static('build'));
app.use(middleware.morganLogger);
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);
app.use('/api/login', loginRoute);
app.use('/api/blogs', blogRoutes);
app.use('/api/users', userRoutes);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;