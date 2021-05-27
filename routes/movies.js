const { Router } = require('express');
const { getMovies } = require('../controllers')

const router = Router();

router
  .get('/', getMovies);


  module.exports = router;