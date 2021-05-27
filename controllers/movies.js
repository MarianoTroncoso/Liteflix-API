const { Movie } = require('../models');

const getMovies = async (req, res) => {
  try {

    const movies = await Movie.find({});
    res.status(200).json(movies);

  } catch (error) {
    res.status(404).json({ message: error.message})
  }
}

const postMovie = (req, res) => {
  res.send('post creation');
}

module.exports = {
  getMovies,
  postMovie
}