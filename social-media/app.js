// app.js
const express = require('express');
const bodyParser = require('body-parser');
const rabbitmqConsumer = require('./services/rabbitmqConsumer');
const userRoutes = require('./routes/appRoutes');
const app = express();
const config = require('config');
const port = process.env.PORT || 3000;
const connectDB = require('./config/db');
const ResponseTime = require('./models/responseTime');

// Middleware
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
            console.log('Error saving response Time:', err.message);
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
            console.log('Server is running on port 3000');
        });
    } catch (error) {
        console.error('Failed to start server', error);
    }
};
startServer();

module.exports = app;
