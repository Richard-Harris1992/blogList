const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  });

  
blogSchema.set('toJSON', {  //this is how you get id to a string instead of an object AND not give the __v field when returning data
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;