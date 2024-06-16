const mongoose = require('mongoose');
const config = require('config');
const logger = require('./logger')

// MongoDB connection
const dbUri = config.get('db.uri');
const connectDB = async () => {
    mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => logger.info('MongoDB connected'))
    .catch(err => logger.info('DDb connection failed',err));
};

module.exports = connectDB;