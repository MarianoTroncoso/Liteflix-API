const mongoose = require('mongoose');

const dbCon = async() => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI, 
      {useNewUrlParser: true, useUnifiedTopology: true}, 
    );

    console.log('MongoDB is Connected...');

  } catch (error) {
    console.log(error.message)
  }
}

module.exports = dbCon
