require('dotenv').config();
const express = require('express');
const dbCon = require('./config/db');

const app = express();

app.use(express.json()); // bodyparser está deprecado
// app.use(cors());

// conectar db
dbCon();

app.get('/', (req, res) => res.send('Hello world!'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));