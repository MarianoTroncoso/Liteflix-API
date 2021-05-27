const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  //! TODO: AGREGAR IMAGEN
  /*
  image: {
    data: Buffer,
    contentType: String
  },
  */
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  }
});

module.exports = Movie = mongoose.model('movie', movieSchema);