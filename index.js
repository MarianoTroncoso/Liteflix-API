require('dotenv').config();
const express = require('express');
// para las imagenes
const mongoose = require('mongoose');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

const methodOverride = require('method-override');

const cors = require('cors');
const { dbCon } = require('./config'); 
const { movieRouter } = require('./routes');
const { Movie } = require('./models');

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(methodOverride('_method'));
app.use(cors());

// crear mongo connection

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true}, () => {
  console.log('Me conecté a Mongo :D')
})

let gfs;
const conn = mongoose.connection;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// const conn = async() => {
//   try {
//     await mongoose.createConnection(
//       process.env.MONGO_URI, 
//       {useNewUrlParser: true, useUnifiedTopology: true}, 
//     );

//     console.log('MongoDB is Connected...');

//   } catch (error) {
//     console.log(error.message);
//   };
// };

// const conn = mongoose.createConnection(process.env.MONGO_URI, {useUnifiedTopology: true, useNewUrlParser: true})

// init gft
/*
let gfs;
conn.once('open', () => {
  // init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');

});
*/

// store engine
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err)
        }

        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads',
        }
        resolve(fileInfo);
      })
    })
  },
});
const upload = multer({ storage })

// upload.single('file') <-- mismo nombre que el input type file en el form

app.post('/movies', upload.single('file'), async (req, res) => {

  console.log('post upload');

  console.log('voy a guardar esta peli')
  console.log({
    name: req.body.name,
    category: req.body.category,
    image: req.file.filename 
  })

  const newMovie = new Movie({
    name: req.body.name,
    category: req.body.category,
    image: req.file.filename 
  });

  try {
    
    await newMovie.save();
    res.status(201).json(newMovie); //! ACÁ ESTA DEVOLVIENDO, O NO?

  } catch (error) {
    res.status(409).json({ message: error.message });
  }

})


// all files 
app.get('/files', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // hay archivos?
    if(!files || files.length === 0){
      return res.status(404).json({
        error: 'No files exist'
      })
    }
    // hay archivos
    return res.json(files)
  })
})

// one file //! CREO QUE NO LO USARÍA 
app.get('/files/:filename', (req, res) => {
  gfs.files.findOne({filename: req.params.filename}, (err, file) => {
    // hay archivo?
    if(!file || file.length === 0){
      return res.status(404).json({
        error: 'No file exist'
      })
    }

    // hay archivo
    return res.json(file)
  });
})

// one file //! CREO QUE NO LO USARÍA
app.get('/image/:filename', (req, res) => {
  gfs.files.findOne({filename: req.params.filename}, (err, file) => {
    // hay archivo?
    if(!file || file.length === 0){
      return res.status(404).json({
        error: 'No file exist'
      })
    }

    // es imagen?
    if(file.contentType === 'image/jpeg' || file.contentType === 'image/jpg' || file.contentType === 'image/png'  ){
      // console.log('es imagen')
      const readstream = gfs.createReadStream(file.filename)
      readstream.pipe(res)
    } else{
      // console.log('no es imagen');
      res.status(404).json({
        err: 'Not an image'
      })
    }
  });
});

// delete imagen //! CREO QUE NO LO USARÍA (el usuario)
app.delete('/files/:id', (req, res) => {
  // remove
  gfs.remove({_id: req.params.id, root:'uploads'}, (err, gridStore) => {
    if(err){
      return res.status(404).json({
        err: err
      })
    }
    // res.redirect('/')
    res.json({
      message: 'Deleted'
    })
  }
  )
});


// routes
app.use('/movies', movieRouter);

// conectar db
// dbCon();

app.get('/', (req, res) => res.send('Hello world!'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));