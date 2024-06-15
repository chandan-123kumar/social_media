const connectRabbitMQ = require('../config/rabbitmq');
exports.handleEvent = async (req, res) => {
    const reqBody = req.body;
    console.log(reqBody);
    connectRabbitMQ((err, channel) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        const queue = 'event';
        channel.assertQueue(queue, {
          durable: true,
        });
    
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(reqBody)), {
          persistent: true,
        });
        res.status(201).json({ message: 'Event handled and sent to queue' });
      });
};    
