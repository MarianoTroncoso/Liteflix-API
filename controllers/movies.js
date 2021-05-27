
const getMovies = (req, res) => {
  res.send('get movies');
}

const postMovie = (req, res) => {
  res.send('post creation');
}

module.exports = {
  getMovies,
  postMovie
}