const { Router } = require('express');
const { getMovies, postMovie } = require('../controllers')

const router = Router();

router
  .get('/', getMovies)
  .post('/', postMovie)


  module.exports = router;