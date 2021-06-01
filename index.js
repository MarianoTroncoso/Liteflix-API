require('dotenv').config();
const express = require('express');
const cors = require('cors')
// const bodyParser = require('body-parser');
const { dbCon } = require('./config');
const { movieRouter } = require('./routes');

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cors())

// routes
app.use('/movies', movieRouter);

// conectar db
dbCon();

app.get('/', (req, res) => res.send('Hello world!'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));