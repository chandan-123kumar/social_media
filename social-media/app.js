// app.js
const express = require('express');
const bodyParser = require('body-parser');
const rabbitmqConsumer = require('./services/rabbitmqConsumer');
const userRoutes = require('./routes/appRoutes');
const app = express();
const config = require('config');
const expressWinston = require('express-winston');
const port = process.env.PORT || 3000;
const connectDB = require('./config/db');
const ResponseTime = require('./models/responseTime');
const logger = require('./config/logger');

// Middleware
app.use(expressWinston.logger({
    winstonInstance: logger,
    meta: true, // Log the meta data about the request
    msg: "HTTP {{req.method}} {{req.url}}", // Define the message to log
    colorize: false,
    ignoreRoute: function (req, res) { return false; } // Don't log routes that match this function
}));
app.use(expressWinston.errorLogger({
    winstonInstance: logger
}));
app.use(bodyParser.json());
app.use((req, res, next) => {
    const startHrTime = process.hrtime();

    res.on('finish', async() => {
        const elapsedHrTime = process.hrtime(startHrTime);
        const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
        const response = new ResponseTime({
            path: req.path,
            time: elapsedTimeInMs.toFixed(3)
        });
        try {
            const newEntry = await response.save();
        } catch (err) {
            logger.error('Error saving response Time:', err.message);
        }
    });

    next();
});

// Routes
app.use('/api', userRoutes);




const startServer = async () => {
    try {
        await connectDB();
        app.listen(3000, () => {
            logger.info(`Server is running on port ${port}`);
        });
    } catch (error) {
        logger.error('Failed to start server', error);
    }
};
startServer();

module.exports = app;
