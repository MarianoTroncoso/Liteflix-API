require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { dbCon } = require('./config');
const { movieRouter } = require('./routes');

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

// routes
app.use('/movies', movieRouter);

// conectar db
dbCon();

app.get('/', (req, res) => res.send('Hello world!'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));