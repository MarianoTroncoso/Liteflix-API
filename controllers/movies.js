const { Movie } = require('../models');

const getMovies = async (req, res) => {
  try {

    const movies = await Movie.find({});
    res.status(200).json(movies);

  } catch (error) {
    res.status(404).json({ message: error.message})
  }
}

const postMovie = async (req, res) => {

  const newMovie = new Movie(req.body);

  try {
    
    await newMovie.save();

    res.status(201).json(newMovie);

  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}

module.exports = {
  getMovies,
  postMovie
}