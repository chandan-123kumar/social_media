// app.js
const express = require('express');
const bodyParser = require('body-parser');
const rabbitmqConsumer = require('./services/rabbitmqConsumer');
const userRoutes = require('./routes/appRoutes');
const app = express();
const config = require('config');
const port = process.env.PORT || 3000;
const connectDB = require('./config/db');

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', userRoutes);

// Example route
app.get('/', (req, res) => {
    res.send('Hello World!');
});



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
