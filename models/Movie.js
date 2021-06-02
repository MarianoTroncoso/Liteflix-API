const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({  
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  image:  {
    type: String,
    required: true
  }
});

module.exports = Movie = mongoose.model('movie', movieSchema);