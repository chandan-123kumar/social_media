const amqp = require('amqplib/callback_api');
const MongoClient = require('mongodb').MongoClient;
const connectRabbitMQ = require('../config/rabbitmq');
const { handleEvent } = require('./dbService');

const mongoURL = 'mongodb://localhost:27017';
const dbName = 'social_media';
let db;

// Connect to MongoDB
MongoClient.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) throw err;
  db = client.db(dbName);
  console.log('Connected to MongoDB');
});

// Connect to RabbitMQ and consume messages
connectRabbitMQ((err, channel) => {
  if (err) throw err;

  const queue = 'event';

  channel.assertQueue(queue, {
    durable: true
  });

  channel.consume(queue, async(msg) => {
    if (msg !== null) {
      const event = JSON.parse(msg.content.toString());
      const insertedEvent = await handleEvent(event);
      channel.ack(msg);
    }
  }, {
    noAck: false
  });
});
