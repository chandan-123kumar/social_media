const connectRabbitMQ = require('../config/rabbitmq');
exports.handleEvent = async (req, res) => {
    const reqBody = req.body;
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
        res.status(200).json({ message: 'Event handled and sent to queue' });
      });
};    
