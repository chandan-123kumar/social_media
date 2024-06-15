const mongoose = require('mongoose');
const config = require('config');

// MongoDB connection
const dbUri = config.get('db.uri');
const connectDB = async () => {
    mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
};

module.exports = connectDB;